'use strict';

const util = require('../util'),
      errors = require('../errors');
const Promise = require('bluebird');
const varar = util.varar;

const Connection = require('./connection'),
      TcpConnection = require('./tcp_connection'),
      HttpConnection = require('./http_connection');

module.exports.isConnection = function(connection) {
  return connection instanceof Connection;
};

module.exports.connect = varar(0, 2, function(hostOrCallback, callback) {
  let host;
  if (typeof hostOrCallback === 'function') {
    host = {};
    callback = hostOrCallback;
  } else {
    host = hostOrCallback || {};
  }

  return new Promise(function(resolve, reject) {
    if ((host.authKey != null) && ((host.password != null) || (host.user != null) || (host.username != null))) {
      throw new errors.ReqlDriverError('Cannot use both authKey and password');
    }

    if (host.user && host.username) {
      throw new errors.ReqlDriverError('Cannot use both user and username');
    } else if (host.authKey) {
      host.user = 'admin';
      host.password = host.authKey;
    } else {
      if (host.username != null) {
        host.user = host.username;
      }
    }

    let createConnection = (function(_this) {
      return function(_host, _callback) {
        if (TcpConnection.isAvailable()) {
          return new TcpConnection(_host, _callback);
        } else if (HttpConnection.isAvailable()) {
          return new HttpConnection(_host, _callback);
        }

        throw new errors.ReqlDriverError('Neither TCP nor HTTP avaiable in this environment');
      };
    })(this);

    let wrappedCb = function(err, result) {
      if (err) return reject(err);
      return resolve(result);
    };

    return createConnection(host, wrappedCb);
  }).nodeify(callback);
});
