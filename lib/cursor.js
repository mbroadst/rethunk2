'use strict';


const bind = function(fn, me) { return function() { return fn.apply(me, arguments); }; },
      slice = [].slice;

const error = require('./errors'),
      util = require('./util'),
      protoResponseType = require('./proto-def').Response.ResponseType,
      Promise = require('bluebird'),
      EventEmitter = require('events').EventEmitter;

const ar = util.ar,
      varar = util.varar,
      mkErr = util.mkErr;

if (typeof setImmediate === 'undefined' || setImmediate === null) {
  setImmediate = function(cb) {
    return setTimeout(cb, 0);
  };
}

function IterableResult(conn, token, opts, root) {
  this._eachCb = bind(this._eachCb, this);
  this._conn = conn;
  this._token = token;
  this._opts = opts;
  this._root = root;
  this._responses = [];
  this._responseIndex = 0;
  this._outstandingRequests = 1;
  this._iterations = 0;
  this._endFlag = false;
  this._contFlag = false;
  this._closeAsap = false;
  this._cont = null;
  this._cbQueue = [];
  this._closeCb = null;
  this._closeCbPromise = null;
  this.next = this._next;
}

IterableResult.prototype.stackSize = 100;

IterableResult.prototype._addResponse = function(response) {
  if (response.t === this._type || response.t === protoResponseType.SUCCESS_SEQUENCE) {
    if (response.r.length > 0) {
      this._responses.push(response);
    }
  } else {
    this._responses.push(response);
  }

  this._outstandingRequests -= 1;
  if (response.t !== this._type) {
    this._endFlag = true;
    if (this._closeCb) {
      switch (response.t) {
      case protoResponseType.COMPILE_ERROR:
        this._closeCb(mkErr(error.ReqlServerCompileError, response, this._root));
        break;
      case protoResponseType.CLIENT_ERROR:
        this._closeCb(mkErr(error.ReqlClientError, response, this._root));
        break;
      case protoResponseType.RUNTIME_ERROR:
        this._closeCb(mkErr(util.errorClass(response.e), response, this._root));
        break;
      default:
        this._closeCb();
      }
    }
  }

  this._contFlag = false;
  if (this._closeAsap === false) {
    this._promptNext();
  } else {
    this.close(this._closeCb);
  }

  return this;
};

IterableResult.prototype._getCallback = function() {
  var cb, immediateCb;
  this._iterations += 1;
  cb = this._cbQueue.shift();
  if (this._iterations % this.stackSize === this.stackSize - 1) {
    immediateCb = (function(err, row) {
      return setImmediate(function() {
        return cb(err, row);
      });
    });
    return immediateCb;
  }

  return cb;
};

IterableResult.prototype._handleRow = function() {
  var cb, response, row;
  response = this._responses[0];
  row = util.recursivelyConvertPseudotype(response.r[this._responseIndex], this._opts);
  cb = this._getCallback();
  this._responseIndex += 1;
  if (this._responseIndex === response.r.length) {
    this._responses.shift();
    this._responseIndex = 0;
  }

  return cb(null, row);
};

IterableResult.prototype.bufferEmpty = function() {
  return this._responses.length === 0 || this._responses[0].r.length <= this._responseIndex;
};

IterableResult.prototype._promptNext = function() {
  var cb, errType, response;
  if (this._closeCbPromise != null) {
    cb = this._getCallback();
    cb(new error.ReqlDriverError("Cursor is closed."));
  }

  while (this._cbQueue[0] != null) {
    if (this.bufferEmpty() === true) {
      if (this._endFlag === true) {
        cb = this._getCallback();
        cb(new error.ReqlDriverError("No more rows in the cursor."));
      } else if (this._responses.length <= 1) {
        this._promptCont();
      }
      return;
    } else {
      response = this._responses[0];
      if (this._responses.length === 1) {
        this._promptCont();
      }
      switch (response.t) {
      case protoResponseType.SUCCESS_PARTIAL:
        this._handleRow();
        break;
      case protoResponseType.SUCCESS_SEQUENCE:
        if (response.r.length === 0) {
          this._responses.shift();
        } else {
          this._handleRow();
        }
        break;
      case protoResponseType.COMPILE_ERROR:
        this._responses.shift();
        cb = this._getCallback();
        cb(mkErr(error.ReqlServerCompileError, response, this._root));
        break;
      case protoResponseType.CLIENT_ERROR:
        this._responses.shift();
        cb = this._getCallback();
        cb(mkErr(error.ReqlClientError, response, this._root));
        break;
      case protoResponseType.RUNTIME_ERROR:
        this._responses.shift();
        cb = this._getCallback();
        errType = util.errorClass(response.e);
        cb(mkErr(errType, response, this._root));
        break;
      default:
        this._responses.shift();
        cb = this._getCallback();
        cb(new error.ReqlDriverError("Unknown response type for cursor"));
      }
    }
  }
};

IterableResult.prototype._promptCont = function() {
  if ((!this._contFlag) && (!this._endFlag) && this._conn.isOpen()) {
    this._contFlag = true;
    this._outstandingRequests += 1;
    return this._conn._continueQuery(this._token);
  }
};

IterableResult.prototype.hasNext = function() {
  throw new error.ReqlDriverError('The `hasNext` command has been removed since 1.13. Use `next` instead.');
};

IterableResult.prototype._next = varar(0, 1, function(cb) {
  if ((cb != null) && typeof cb !== "function") {
    throw new error.ReqlDriverError('First argument to `next` must be a function or undefined.');
  }

  var fn = (function(_this) {
    return function(cb) {
      _this._cbQueue.push(cb);
      return _this._promptNext();
    };
  })(this);

  return Promise.fromNode(fn).nodeify(cb);
});

IterableResult.prototype.close = varar(0, 1, function(cb) {
  if (this._closeCbPromise) {
    if (this._closeCbPromise.isPending()) {
      this._closeCbPromise = this._closeCbPromise.nodeify(cb);
    } else {
      this._closeCbPromise = Promise.resolve().nodeify(cb);
    }
  } else {
    if (this._endFlag) {
      this._closeCbPromise = Promise.resolve().nodeify(cb);
      this._responses = [];
      this._responseIndex = 0;
    } else {
      this._closeCbPromise = new Promise((function(_this) {
        return function(resolve, reject) {
          _this._closeCb = function(err) {
            _this._responses = [];
            _this._responseIndex = 0;
            while (_this._cbQueue.length > 0) {
              _this._cbQueue.shift();
            }
            _this._outstandingRequests = 0;
            if (err) {
              return reject(err);
            } else {
              return resolve();
            }
          };
          _this._closeAsap = true;
          _this._outstandingRequests += 1;
          return _this._conn._endQuery(_this._token);
        };
      })(this)).nodeify(cb);
    }
  }

  return this._closeCbPromise;
});

IterableResult.prototype.each = varar(1, 2, function(cb, onFinished) {
  var nextCb, self;
  if (typeof cb !== 'function') {
    throw new error.ReqlDriverError('First argument to each must be a function.');
  }

  if (onFinished && typeof onFinished !== 'function') {
    throw new error.ReqlDriverError('Optional second argument to each must be a function.');
  }

  self = this;
  nextCb = (function(_this) {
    return function(err, data) {
      if (err != null) {
        if (err.message === 'No more rows in the cursor.') {
          return typeof onFinished === 'function' ? onFinished() : void 0;
        } else {
          return cb(err);
        }
      } else if (cb(null, data) !== false) {
        return _this._next(nextCb);
      } else {
        return typeof onFinished === 'function' ? onFinished() : void 0;
      }
    };
  })(this);

  return this._next(nextCb);
});

IterableResult.prototype.eachAsync = varar(1, 3, function(cb, errCb, options) {
  var nextCb, pending, resPromise, userCb;
  if (options == null) {
    options = {
      concurrency: 1
    };
  }

  if (typeof cb !== 'function') {
    throw new error.ReqlDriverError('First argument to eachAsync must be a function.');
  }

  if (errCb) {
    if (typeof errCb === 'object') {
      options = errCb;
      errCb = void 0;
    } else if (typeof errCb !== 'function') {
      throw new error.ReqlDriverError('Optional second argument to eachAsync must be a function or `options` object');
    }
  }

  if (!(options && typeof options.concurrency === 'number' && options.concurrency > 0)) {
    throw new error.ReqlDriverError('Optional `options.concurrency` argument to eachAsync must be a positive number');
  }

  pending = [];
  userCb = function(data) {
    var doneChecking, handlerArg, handlerCalled, ret;
    if (cb.length <= 1) {
      ret = Promise.resolve(cb(data));
    } else {
      handlerCalled = false;
      doneChecking = false;
      handlerArg = void 0;
      ret = Promise.fromNode(function(handler) {
        var asyncRet;
        asyncRet = cb(data, function(err) {
          handlerCalled = true;
          if (doneChecking) {
            return handler(err);
          } else {
            return handlerArg = err;
          }
        });
        if (asyncRet !== void 0) {
          handler(new error.ReqlDriverError('A two-argument row handler for eachAsync may only return undefined.'));
        } else if (handlerCalled) {
          handler(handlerArg);
        }
        return doneChecking = true;
      });
    }

    return ret.then(function(data) {
      if (data === void 0 || typeof data === Promise) {
        return data;
      }
      throw new error.ReqlDriverError('Row handler for eachAsync may only return a Promise or undefined.');
    });
  };

  nextCb = (function(_this) {
    return function() {
      if (_this._closeCbPromise) {
        return Promise.resolve().then(function(data) {
          throw new error.ReqlDriverError('Cursor is closed.');
        });
      } else {
        return _this._next().then(function(data) {
          if (pending.length < options.concurrency) {
            return data;
          }
          return Promise.any(pending)["catch"](Promise.AggregateError, function(errs) {
            throw errs[0];
          })["return"](data);
        }).then(function(data) {
          var p;
          p = userCb(data).then(function() {
            return pending.splice(pending.indexOf(p), 1);
          });
          return pending.push(p);
        }).then(nextCb)["catch"](function(err) {
          if ((err != null ? err.message : void 0) !== 'No more rows in the cursor.') {
            throw err;
          }
          return Promise.all(pending);
        });
      }
    };
  })(this);

  resPromise = nextCb().then(function() {
    if (errCb) {
      return errCb(null);
    }
  })["catch"](function(err) {
    if (errCb) {
      return errCb(err);
    }
    throw err;
  });

  if (errCb == null) {
    return resPromise;
  }

  return null;
});

IterableResult.prototype._each = IterableResult.prototype.each;

IterableResult.prototype._eachAsync = IterableResult.prototype.eachAsync;

IterableResult.prototype.toArray = varar(0, 1, function(cb) {
  var results, wrapper;
  if (cb && typeof cb !== 'function') {
    throw new error.ReqlDriverCompileError('First argument to `toArray` must be a function or undefined.');
  }

  results = [];
  wrapper = (function(_this) {
    return function(res) {
      results.push(res);
      return void 0;
    };
  })(this);

  return this.eachAsync(wrapper).then((function(_this) {
    return function() {
      return results;
    };
  })(this)).nodeify(cb);
});

IterableResult.prototype._makeEmitter = function() {
  this.emitter = new EventEmitter;
  this.each = function() {
    throw new error.ReqlDriverError('You cannot use the cursor interface and the EventEmitter interface at the same time.');
  };

  return this.next = function() {
    throw new error.ReqlDriverError('You cannot use the cursor interface and the EventEmitter interface at the same time.');
  };
};

IterableResult.prototype.addListener = function(event, listener) {
  if (this.emitter == null) {
    this._makeEmitter();
    setImmediate((function(_this) {
      return function() {
        return _this._each(_this._eachCb);
      };
    })(this));
  }

  return this.emitter.addListener(event, listener);
};

IterableResult.prototype.on = function(event, listener) {
  if (this.emitter == null) {
    this._makeEmitter();
    setImmediate((function(_this) {
      return function() {
        return _this._each(_this._eachCb);
      };
    })(this));
  }

  return this.emitter.on(event, listener);
};

IterableResult.prototype.once = function(event, listener) {
  if (this.emitter == null) {
    this._makeEmitter();
    setImmediate((function(_this) {
      return function() {
        return _this._each(_this._eachCb);
      };
    })(this));
  }

  return this.emitter.once(event, listener);
};

IterableResult.prototype.removeListener = function(event, listener) {
  if (this.emitter == null) {
    this._makeEmitter();
    setImmediate((function(_this) {
      return function() {
        return _this._each(_this._eachCb);
      };
    })(this));
  }

  return this.emitter.removeListener(event, listener);
};

IterableResult.prototype.removeAllListeners = function(event) {
  if (this.emitter == null) {
    this._makeEmitter();
    setImmediate((function(_this) {
      return function() {
        return _this._each(_this._eachCb);
      };
    })(this));
  }

  return this.emitter.removeAllListeners(event);
};

IterableResult.prototype.setMaxListeners = function(n) {
  if (this.emitter == null) {
    this._makeEmitter();
    setImmediate((function(_this) {
      return function() {
        return _this._each(_this._eachCb);
      };
    })(this));
  }

  return this.emitter.setMaxListeners(n);
};

IterableResult.prototype.listeners = function(event) {
  if (this.emitter == null) {
    this._makeEmitter();
    setImmediate((function(_this) {
      return function() {
        return _this._each(_this._eachCb);
      };
    })(this));
  }

  return this.emitter.listeners(event);
};

IterableResult.prototype.emit = function() {
  var args, ref;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  if (this.emitter == null) {
    this._makeEmitter();
    setImmediate((function(_this) {
      return function() {
        return _this._each(_this._eachCb);
      };
    })(this));
  }

  return (ref = this.emitter).emit.apply(ref, args);
};

IterableResult.prototype._eachCb = function(err, data) {
  if (err) {
    return this.emitter.emit('error', err);
  }

  return this.emitter.emit('data', data);
};

/**
 *
 */
function Cursor() {
  this._type = protoResponseType.SUCCESS_PARTIAL;
  Cursor.super_.apply(this, arguments);
}
util.inherits(Cursor, IterableResult);

Cursor.prototype.toString = ar(function() {
  return '[object Cursor]';
});

/**
 *
 */
function Feed() {
  this._type = protoResponseType.SUCCESS_PARTIAL;
  Feed.super_.apply(this, arguments);
}
util.inherits(Feed, IterableResult);

Feed.prototype.hasNext = function() {
  throw new error.ReqlDriverError('`hasNext` is not available for feeds.');
};

Feed.prototype.toArray = function() {
  throw new error.ReqlDriverError('`toArray` is not available for feeds.');
};

Feed.prototype.toString = ar(function() {
  return '[object Feed]';
});

/**
 *
 */
function UnionedFeed() {
  this._type = protoResponseType.SUCCESS_PARTIAL;
  UnionedFeed.super_.apply(this, arguments);
}
util.inherits(UnionedFeed, IterableResult);

UnionedFeed.prototype.hasNext = function() {
  throw new error.ReqlDriverError('`hasNext` is not available for feeds.');
};

UnionedFeed.prototype.toArray = function() {
  throw new error.ReqlDriverError('`toArray` is not available for feeds.');
};

UnionedFeed.prototype.toString = ar(function() {
  return '[object UnionedFeed]';
});

/**
 *
 */
function AtomFeed() {
  this._type = protoResponseType.SUCCESS_PARTIAL;
  AtomFeed.super_.apply(this, arguments);
}
util.inherits(AtomFeed, IterableResult);

AtomFeed.prototype.hasNext = function() {
  throw new error.ReqlDriverError('`hasNext` is not available for feeds.');
};

AtomFeed.prototype.toArray = function() {
  throw new error.ReqlDriverError('`toArray` is not available for feeds.');
};

AtomFeed.prototype.toString = ar(function() {
  return '[object AtomFeed]';
});

/**
 *
 */
function OrderByLimitFeed() {
  this._type = protoResponseType.SUCCESS_PARTIAL;
  OrderByLimitFeed.super_.apply(this, arguments);
}
util.inherits(OrderByLimitFeed, IterableResult);

OrderByLimitFeed.prototype.hasNext = function() {
  throw new error.ReqlDriverError('`hasNext` is not available for feeds.');
};

OrderByLimitFeed.prototype.toArray = function() {
  throw new error.ReqlDriverError('`toArray` is not available for feeds.');
};

OrderByLimitFeed.prototype.toString = ar(function() {
  return '[object OrderByLimitFeed]';
});

/**
 *
 */
function ArrayResult() {
  return ArrayResult.super_.apply(this, arguments);
}
util.inherits(ArrayResult, IterableResult);

ArrayResult.prototype._hasNext = ar(function() {
  if (this.__index == null) {
    this.__index = 0;
  }
  return this.__index < this.length;
});

ArrayResult.prototype._next = varar(0, 1, function(cb) {
  var fn;
  fn = (function(_this) {
    return function(cb) {
      var self;
      if (_this._closeCbPromise) {
        cb(new error.ReqlDriverError('Cursor is closed.'));
      }
      if (_this._hasNext() === true) {
        self = _this;
        if (self.__index % _this.stackSize === _this.stackSize - 1) {
          return setImmediate(function() {
            return cb(null, self[self.__index++]);
          });
        } else {
          return cb(null, self[self.__index++]);
        }
      } else {
        return cb(new error.ReqlDriverError('No more rows in the cursor.'));
      }
    };
  })(this);
  return Promise.fromNode(fn).nodeify(cb);
});

ArrayResult.prototype.toArray = varar(0, 1, function(cb) {
  var fn;
  fn = (function(_this) {
    return function(cb) {
      if (_this._closeCbPromise) {
        cb(new error.ReqlDriverError('Cursor is closed.'));
      }
      if (_this.__index) {
        return cb(null, _this.slice(_this.__index, _this.length));
      } else {
        return cb(null, _this);
      }
    };
  })(this);
  return Promise.fromNode(fn).nodeify(cb);
});

ArrayResult.prototype.close = varar(0, 1, function(cb) {
  this.length = 0;
  this.__index = 0;
  this._closeCbPromise = Promise.resolve().nodeify(cb);
  return this._closeCbPromise;
});

ArrayResult.prototype.makeIterable = function(response) {
  var method, name, ref;
  response.__proto__ = {};
  ref = ArrayResult.prototype;
  for (name in ref) {
    method = ref[name];
    if (name !== 'constructor') {
      if (name === '_next') {
        response.__proto__['next'] = method;
        response.__proto__['_next'] = method;
      } else {
        response.__proto__[name] = method;
      }
    }
  }
  response.__proto__.__proto__ = [].__proto__;
  return response;
};

module.exports.Cursor = Cursor;
module.exports.Feed = Feed;
module.exports.AtomFeed = AtomFeed;
module.exports.OrderByLimitFeed = OrderByLimitFeed;
module.exports.makeIterable = ArrayResult.prototype.makeIterable;
