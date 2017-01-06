'use strict';
const Promise = require('bluebird'),
      EventEmitter = require('events'),
      errors = require('../errors');

const hasProp = {}.hasOwnProperty;

const util = require('../util'),
      cursors = require('../cursor'),
      protodef = require('../proto-def'),
      r = require('../ast');

const varar = util.varar,
      ar = util.ar,
      mkAtom = util.mkAtom,
      mkErr = util.mkErr;

const protoQueryType = protodef.Query.QueryType,
      protoResponseType = protodef.Response.ResponseType;

class Connection extends EventEmitter {
  constructor(host, callback) {
    super();

    if (typeof host === 'undefined') {
      host = {};
    } else if (typeof host === 'string') {
      host = {
        host: host
      };
    }

    this.host = host.host || this.DEFAULT_HOST;
    this.port = host.port || this.DEFAULT_PORT;
    this.db = host.db;
    this.authKey = host.authKey || this.DEFAULT_AUTH_KEY;
    this.timeout = host.timeout || this.DEFAULT_TIMEOUT;
    if (typeof host.ssl === 'boolean' && host.ssl) {
      this.ssl = {};
    } else if (typeof host.ssl === 'object') {
      this.ssl = host.ssl;
    } else {
      this.ssl = false;
    }
    this.outstandingCallbacks = {};
    this.nextToken = 1;
    this.open = false;
    this.closing = false;
    this.buffer = new Buffer(0);
    this._events = this._events || {};
    let errCallback = (function(_this) {
      return function(e) {
        _this.removeListener('connect', conCallback);
        if (e instanceof errors.ReqlError) {
          return callback(e);
        }

        return callback(new errors.ReqlDriverError(`Could not connect to ${_this.host}:${_this.port}.\n${e.message}`));
      };
    })(this);

    this.once('error', errCallback);

    let conCallback = (function(_this) {
      return function() {
        _this.removeListener('error', errCallback);
        _this.open = true;
        return callback(null, _this);
      };
    })(this);
    this.once('connect', conCallback);
    this._closePromise = null;
  }
}

Connection.prototype.DEFAULT_HOST = 'localhost';
Connection.prototype.DEFAULT_PORT = 28015;
Connection.prototype.DEFAULT_AUTH_KEY = '';
Connection.prototype.DEFAULT_TIMEOUT = 20;

Connection.prototype._data = function(buf) {
  this.buffer = Buffer.concat([this.buffer, buf]);
  let results = [];
  while (this.buffer.length >= 12) {
    let token = this.buffer.readUInt32LE(0) + 0x100000000 * this.buffer.readUInt32LE(4);
    let responseLength = this.buffer.readUInt32LE(8);
    if (!(this.buffer.length >= (12 + responseLength))) {
      break;
    }

    let responseBuffer = this.buffer.slice(12, responseLength + 12);
    let response = JSON.parse(responseBuffer);
    this._processResponse(response, token);
    results.push(this.buffer = this.buffer.slice(12 + responseLength));
  }
  return results;
};

Connection.prototype._delQuery = function(token) {
  return delete this.outstandingCallbacks[token];
};

Connection.prototype._processResponse = function(response, token) {
  let cb, cursor, errType, k, len1, note, opts, profile, ref, ref1, root;
  profile = response.p;
  if (this.outstandingCallbacks[token] != null) {
    ref = this.outstandingCallbacks[token], cb = ref.cb, root = ref.root, cursor = ref.cursor, opts = ref.opts;
    if (cursor != null) {
      cursor._addResponse(response);
      if (cursor._endFlag && cursor._outstandingRequests === 0) {
        return this._delQuery(token);
      }
    } else if (cb != null) {
      switch (response.t) {
      case protoResponseType.COMPILE_ERROR:
        cb(mkErr(errors.ReqlServerCompileError, response, root));
        return this._delQuery(token);
      case protoResponseType.CLIENT_ERROR:
        cb(mkErr(errors.ReqlDriverError, response, root));
        return this._delQuery(token);
      case protoResponseType.RUNTIME_ERROR:
        errType = util.errorClass(response.e);
        cb(mkErr(errType, response, root));
        return this._delQuery(token);
      case protoResponseType.SUCCESS_ATOM:
        response = mkAtom(response, opts);
        if (Array.isArray(response)) {
          response = cursors.makeIterable(response);
        }
        if (profile != null) {
          response = { profile: profile, value: response };
        }
        cb(null, response);
        return this._delQuery(token);
      case protoResponseType.SUCCESS_PARTIAL:
        cursor = null;
        ref1 = response.n;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          note = ref1[k];
          switch (note) {
          case protodef.Response.ResponseNote.SEQUENCE_FEED:
            if (cursor == null) {
              cursor = new cursors.Feed(this, token, opts, root);
            }
            break;
          case protodef.Response.ResponseNote.UNIONED_FEED:
            if (cursor == null) {
              cursor = new cursors.UnionedFeed(this, token, opts, root);
            }
            break;
          case protodef.Response.ResponseNote.ATOM_FEED:
            if (cursor == null) {
              cursor = new cursors.AtomFeed(this, token, opts, root);
            }
            break;
          case protodef.Response.ResponseNote.ORDER_BY_LIMIT_FEED:
            if (cursor == null) {
              cursor = new cursors.OrderByLimitFeed(this, token, opts, root);
            }
          }
        }
        if (cursor == null) {
          cursor = new cursors.Cursor(this, token, opts, root);
        }
        this.outstandingCallbacks[token].cursor = cursor;
        if (profile != null) {
          return cb(null, {
            profile: profile,
            value: cursor._addResponse(response)
          });
        }
        return cb(null, cursor._addResponse(response));
      case protoResponseType.SUCCESS_SEQUENCE:
        cursor = new cursors.Cursor(this, token, opts, root);
        this._delQuery(token);
        if (profile != null) {
          return cb(null, {
            profile: profile,
            value: cursor._addResponse(response)
          });
        }
        return cb(null, cursor._addResponse(response));
      case protoResponseType.WAIT_COMPLETE:
        this._delQuery(token);
        return cb(null, null);
      case protoResponseType.SERVER_INFO:
        this._delQuery(token);
        response = mkAtom(response, opts);
        return cb(null, response);
      default:
        return cb(new errors.ReqlDriverError('Unknown response type'));
      }
    }
  }
  // } else {

  // }
};

Connection.prototype.close = varar(0, 2, function(optsOrCallback, callback) {
  let cb, key, noreplyWait, opts;
  if (callback != null) {
    opts = optsOrCallback;
    if (Object.prototype.toString.call(opts) !== '[object Object]') {
      throw new errors.ReqlDriverError('First argument to two-argument `close` must be an object.');
    }
    cb = callback;
  } else if (Object.prototype.toString.call(optsOrCallback) === '[object Object]') {
    opts = optsOrCallback;
    cb = null;
  } else if (typeof optsOrCallback === 'function') {
    opts = {};
    cb = optsOrCallback;
  } else {
    opts = optsOrCallback;
    cb = null;
  }

  for (key in opts) {
    if (!hasProp.call(opts, key)) continue;
    if (key !== 'noreplyWait') {
      throw new errors.ReqlDriverError('First argument to two-argument `close` must be { noreplyWait: <bool> }.');
    }
  }

  if (this._closePromise) {
    return this._closePromise.nodeify(cb);
  }

  this.closing = true;
  noreplyWait =
    ((opts.noreplyWait === null || opts.noreplyWait === undefined) || opts.noreplyWait) && this.open;
  this._closePromise = new Promise((function(_this) {
    return function(resolve, reject) {
      let wrappedCb;
      wrappedCb = function(err, result) {
        _this.open = false;
        _this.closing = false;
        _this.cancel();

        if (err) return reject(err);
        return resolve(result);
      };

      if (noreplyWait) {
        return _this.noreplyWait(wrappedCb);
      }
      return wrappedCb();
    };
  })(this));

  return this._closePromise.nodeify(cb);
});

Connection.prototype.noreplyWait = varar(0, 1, function(callback) {
  let query, token;
  if (!this.open) {
    return new Promise(function(resolve, reject) {
      return reject(new errors.ReqlDriverError('Connection is closed.'));
    }).nodeify(callback);
  }
  token = this.nextToken++;
  query = {};
  query.type = protoQueryType.NOREPLY_WAIT;
  query.token = token;
  return new Promise((function(_this) {
    return function(resolve, reject) {
      let wrappedCb;
      wrappedCb = function(err, result) {
        if (err) return reject(err);
        return resolve(result);
      };
      _this.outstandingCallbacks[token] = {
        cb: wrappedCb,
        root: null,
        opts: null
      };
      return _this._sendQuery(query);
    };
  })(this)).nodeify(callback);
});

Connection.prototype.server = varar(0, 1, function(callback) {
  let query, token;
  if (!this.open) {
    return new Promise(function(resolve, reject) {
      return reject(new errors.ReqlDriverError('Connection is closed.'));
    }).nodeify(callback);
  }
  token = this.nextToken++;
  query = {};
  query.type = protoQueryType.SERVER_INFO;
  query.token = token;
  return new Promise((function(_this) {
    return function(resolve, reject) {
      let wrappedCb;
      wrappedCb = function(err, result) {
        if (err) return reject(err);
        return resolve(result);
      };
      _this.outstandingCallbacks[token] = {
        cb: wrappedCb,
        root: null,
        opts: null
      };
      return _this._sendQuery(query);
    };
  })(this)).nodeify(callback);
});

Connection.prototype.cancel = ar(function() {
  let response = {
    t: protoResponseType.RUNTIME_ERROR,
    r: [ 'Connection is closed.' ],
    b: []
  };

  let ref = this.outstandingCallbacks;
  for (let key in ref) {
    if (!hasProp.call(ref, key)) continue;
    let value = ref[key];
    if (value.cursor != null) {
      value.cursor._addResponse(response);
    } else if (value.cb != null) {
      value.cb(mkErr(util.errorClass(response.e), response, value.root));
    }
  }
  this.outstandingCallbacks = {};
});

Connection.prototype.reconnect = varar(0, 2, function(optsOrCallback, callback) {
  let cb, opts;
  if (callback != null) {
    opts = optsOrCallback;
    cb = callback;
  } else if (typeof optsOrCallback === 'function') {
    opts = {};
    cb = optsOrCallback;
  } else {
    if (optsOrCallback != null) {
      opts = optsOrCallback;
    } else {
      opts = {};
    }
    cb = callback;
  }

  return new Promise((function(_this) {
    return function(resolve, reject) {
      let closeCb;
      closeCb = function(err) {
        return _this.constructor.call(_this, {
          host: _this.host,
          port: _this.port,
          timeout: _this.timeout,
          authKey: _this.authKey
        }, function(_err, conn) {
          if (_err) return reject(_err);
          return resolve(conn);
        });
      };
      return _this.close(opts, closeCb);
    };
  })(this)).nodeify(cb);
});

Connection.prototype.use = ar(function(db) {
  this.db = db;
});

Connection.prototype.isOpen = function() {
  return this.open && !this.closing;
};

Connection.prototype._start = function(term, cb, opts) {
  if (!this.open) {
    throw new errors.ReqlDriverError('Connection is closed.');
  }

  let token = this.nextToken++;
  let query = {};
  query.global_optargs = {};
  query.type = protoQueryType.START;
  query.query = term.build();
  query.token = token;

  for (let key in opts) {
    if (!hasProp.call(opts, key)) continue;
    query.global_optargs[util.fromCamelCase(key)] = r.expr(opts[key]).build();
  }

  if ((opts.db != null) || (this.db != null)) {
    query.global_optargs.db = r.db(opts.db || this.db).build();
  }

  if (opts.noreply != null) {
    query.global_optargs.noreply = r.expr(!!opts.noreply).build();
  }

  if (opts.profile != null) {
    query.global_optargs.profile = r.expr(!!opts.profile).build();
  }

  if ((opts.noreply == null) || !opts.noreply) {
    this.outstandingCallbacks[token] = {
      cb: cb,
      root: term,
      opts: opts
    };
  }

  this._sendQuery(query);
  if ((opts.noreply != null) && opts.noreply && typeof cb === 'function') {
    cb(null);
  }
};

Connection.prototype._continueQuery = function(token) {
  if (!this.open) {
    throw new errors.ReqlDriverError('Connection is closed.');
  }

  let query = {
    type: protoQueryType.CONTINUE,
    token: token
  };
  return this._sendQuery(query);
};

Connection.prototype._endQuery = function(token) {
  if (!this.open) {
    throw new errors.ReqlDriverError('Connection is closed.');
  }

  let query = {
    type: protoQueryType.STOP,
    token: token
  };
  return this._sendQuery(query);
};

Connection.prototype._sendQuery = function(query) {
  let data = [query.type];
  if (!(query.query === void 0)) {
    data.push(query.query);
    if ((query.global_optargs != null) && Object.keys(query.global_optargs).length > 0) {
      data.push(query.global_optargs);
    }
  }

  return this._writeQuery(query.token, JSON.stringify(data));
};

module.exports = Connection;
