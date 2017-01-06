'use strict';
const Connection = require('./connection');
const util = require('../util'),
      err = require('../errors');
const varar = util.varar;

/**
 *
 */
class HttpConnection extends Connection {
  constructor(host, callback) {
    let protocol, url, xhr;
    if (!HttpConnection.isAvailable()) {
      throw new err.ReqlDriverError('XMLHttpRequest is not available in this environment');
    }

    super(host, callback);
    protocol = host.protocol === 'https' ? 'https' : this.DEFAULT_PROTOCOL;
    url = protocol + '://' + this.host + ':' + this.port + host.pathname + 'ajax/reql/';
    xhr = new XMLHttpRequest;
    xhr.open('POST', url + ('open-new-connection?cacheBuster=' + (Math.random())), true);
    xhr.responseType = 'text';
    xhr.onreadystatechange = (function(_this) {
      return function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            _this._url = url;
            _this._connId = xhr.response;
            _this.emit('connect');
          } else {
            _this.emit('error', new err.ReqlDriverError(`XHR error, http status ${xhr.status}.`));
          }
        }
      };
    })(this);
    xhr.send();
    this.xhr = xhr;
  }
}

HttpConnection.prototype.DEFAULT_PROTOCOL = 'http';

HttpConnection.isAvailable = function() {
  return typeof XMLHttpRequest !== 'undefined';
};

HttpConnection.prototype.cancel = function() {
  if (this._connId != null) {
    this.xhr.abort();
    let xhr = new XMLHttpRequest;
    xhr.open('POST', this._url + 'close-connection?conn_id=' + this._connId, true);
    xhr.responseType = 'arraybuffer';
    xhr.send();
    this._url = null;
    this._connId = null;
    Connection.prototype.cancel.call(this);
  }
};

HttpConnection.prototype.close = varar(0, 2, function(optsOrCallback, callback) {
  let cb, opts;
  if (callback != null) {
    opts = optsOrCallback;
    cb = callback;
  } else if (Object.prototype.toString.call(optsOrCallback) === '[object Object]') {
    opts = optsOrCallback;
    cb = null;
  } else {
    opts = {};
    cb = optsOrCallback;
  }
  if (!((cb == null) || typeof cb === 'function')) {
    throw new err.ReqlDriverError('Final argument to `close` must be a callback function or object.');
  }
  return Connection.prototype.close.call(this, opts, cb);
});

HttpConnection.prototype._writeQuery = function(token, data) {
  let buf = new Buffer(encodeURI(data).split(/%..|./).length - 1 + 8);
  buf.writeUInt32LE(token & 0xFFFFFFFF, 0);
  buf.writeUInt32LE(Math.floor(token / 0xFFFFFFFF), 4);
  buf.write(data, 8);
  return this.write(buf, token);
};

HttpConnection.prototype.write = function(chunk, token) {
  let i, view, xhr;
  xhr = new XMLHttpRequest;
  xhr.open('POST', this._url + '?conn_id=' + this._connId, true);
  xhr.responseType = 'arraybuffer';
  xhr.onreadystatechange = (function(_this) {
    return function(e) {
      let b, buf;
      if (xhr.readyState === 4 && xhr.status === 200) {
        buf = new Buffer((function() {
          let k, len1, ref, results;
          ref = new Uint8Array(xhr.response);
          results = [];
          for (k = 0, len1 = ref.length; k < len1; k++) {
            b = ref[k];
            results.push(b);
          }
          return results;
        })());
        return _this._data(buf);
      }
    };
  })(this);
  xhr.onerror = (function(_this) {
    return function(e) {
      return _this.outstandingCallbacks[token].cb(new Error('This HTTP connection is not open'));
    };
  })(this);
  view = new Uint8Array(chunk.length);
  i = 0;
  while (i < chunk.length) {
    view[i] = chunk[i];
    i++;
  }
  xhr.send(view);
  this.xhr = xhr;
};

module.exports = HttpConnection;
