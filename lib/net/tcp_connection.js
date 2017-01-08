const Promise = require('bluebird'),
      Connection = require('./connection');

const net = require('net'),
      tls = require('tls'),
      util = require('../util'),
      errors = require('../errors'),
      protodef = require('../proto-def'),
      crypto = require('crypto');

const varar = util.varar;
const protoVersion = protodef.VersionDummy.Version.V1_0,
      protoVersionNumber = 0,
      protoProtocol = protodef.VersionDummy.Protocol.JSON;

let pbkdf2Cache = {};

const errorHandler = function(connection) {
  return function(err) {
    return connection.emit('error', err);
  };
};

const closeHandler = function(connection) {
  return function() {
    if (connection.isOpen()) {
      connection.close({ noreplyWait: false });
    }
    connection.emit('close');
  };
};

const timeoutHandler = function(connection) {
  return function() {
    connection.open = false;
    return connection.emit('timeout');
  };
};


const connectHandler = function(connection, host, timeout) {
  return function() {
    let version = new Buffer(4);
    version.writeUInt32LE(protoVersion, 0);
    let protocol = new Buffer(4);
    protocol.writeUInt32LE(protoProtocol, 0);
    let randomString = new Buffer(crypto.randomBytes(18)).toString('base64');
    connection.rawSocket.user = host.user;
    connection.rawSocket.password = host.password;
    if (connection.rawSocket.user === void 0) {
      connection.rawSocket.user = 'admin';
    }
    if (connection.rawSocket.password === void 0) {
      connection.rawSocket.password = '';
    }
    let clientFirstMessageBare = 'n=' + connection.rawSocket.user + ',r=' + randomString;
    let message = JSON.stringify({
      protocol_version: protoVersionNumber,
      authentication_method: 'SCRAM-SHA-256',
      authentication: 'n,,' + clientFirstMessageBare
    });
    let nullbyte = new Buffer('\0', 'binary');
    connection.rawSocket.write(Buffer.concat([version, new Buffer(message.toString()), nullbyte]));
    let state = 1;
    let min = 0;
    let max = 0;
    let serverFirstMessage = '';
    let serverSignature = '';
    let authResponse = '';
    let authSalt = '';
    let authIterations = 0;

    let xorBytes = function(a, b) {
      let i, k, len, ref, res;
      res = [];
      len = Math.min(a.length, b.length);
      for (i = k = 0, ref = len; ref >= 0 ? k < ref : k > ref; i = ref >= 0 ? ++k : --k) {
        res.push(a[i] ^ b[i]);
      }
      return new Buffer(res);
    };

    let pbkdf2Hmac = function(password, salt, iterations) {
      let c, k, mac, ref, t, u;

      let cacheString = password.toString('base64') + ',' + salt.toString('base64') + ',' + iterations.toString();
      if (pbkdf2Cache[cacheString]) {
        return pbkdf2Cache[cacheString];
      }
      mac = crypto.createHmac('sha256', password);
      mac.update(salt);
      mac.update('\x00\x00\x00\x01');
      u = mac.digest();
      t = u;
      for (c = k = 0, ref = iterations - 1; ref >= 0 ? k < ref : k > ref; c = ref >= 0 ? ++k : --k) {
        mac = crypto.createHmac('sha256', password);
        mac.update(t);
        t = mac.digest();
        u = xorBytes(u, t);
      }
      pbkdf2Cache[cacheString] = u;
      return u;
    };

    let compareDigest = function(a, b) {
      let i, k, left, len, ref, result, right;
      left = void 0;
      right = b;
      result = void 0;
      if (a.length === b.length) {
        left = a;
        result = 0;
      }
      if (a.length !== b.length) {
        left = b;
        result = 1;
      }
      len = Math.min(left.length, right.length);
      for (i = k = 0, ref = len; ref >= 0 ? k < ref : k > ref; i = ref >= 0 ? ++k : --k) {
        result |= left[i] ^ right[i];
      }
      return result === 0;
    };

    let handshakeError = function(code, _message) {
      if ((code >= 10 && code <= 20)) {
        return connection.emit('error', new errors.ReqlAuthError(_message));
      }
      return connection.emit('error', new errors.ReqlDriverError(_message));
    };

    let handshakeCallback = function(buf) {
      let authMessage, authentication, b, clientFinalMessageWithoutProof, clientKey, clientProof,
          clientSignature, firstEquals, i, item, j, k, l, len1, len2, ref, ref1,
          saltedPassword, serverKey, serverReply, statusBuf, statusStr, storedKey, v;


      connection.buffer = Buffer.concat([connection.buffer, buf]);
      j = 0;
      ref = connection.buffer;
      for (i = k = 0, len1 = ref.length; k < len1; i = ++k) {
        b = ref[i];
        if (b === 0) {
          statusBuf = connection.buffer.slice(j, i);
          j = i + 1;
          statusStr = statusBuf.toString();
          try {
            serverReply = JSON.parse(statusStr);
          } catch (error1) {
            throw new errors.ReqlDriverError(statusStr);
          }
          if (state === 1) {
            if (!serverReply.success) {
              handshakeError(serverReply.error_code, serverReply.error);
              return;
            }
            min = serverReply.min_protocol_version;
            max = serverReply.max_protocol_version;
            if (min > protoVersionNumber || max < protoVersionNumber) {
              throw new errors.ReqlDriverError('Unsupported protocol version ' + protoVersionNumber + ', expected between ' + min + ' and ' + max + '.');
            }
            state = 2;
          } else if (state === 2) {
            if (!serverReply.success) {
              handshakeError(serverReply.error_code, serverReply.error);
              return;
            }
            authentication = {};
            serverFirstMessage = serverReply.authentication;
            ref1 = serverFirstMessage.split(',');
            for (l = 0, len2 = ref1.length; l < len2; l++) {
              item = ref1[l];
              i = item.indexOf('=');
              authentication[item.slice(0, i)] = item.slice(i + 1);
            }
            authResponse = authentication.r;
            authSalt = new Buffer(authentication.s, 'base64');
            authIterations = parseInt(authentication.i, 10);
            if (!(authResponse.substr(0, randomString.length) === randomString)) {
              throw new errors.ReqlAuthError('Invalid nonce from server');
            }
            clientFinalMessageWithoutProof = 'c=biws,r=' + authResponse;
            saltedPassword = pbkdf2Hmac(connection.rawSocket.password, authSalt, authIterations);
            clientKey = crypto.createHmac('sha256', saltedPassword).update('Client Key').digest();
            storedKey = crypto.createHash('sha256').update(clientKey).digest();
            authMessage = clientFirstMessageBare + ',' + serverFirstMessage + ',' + clientFinalMessageWithoutProof;
            clientSignature = crypto.createHmac('sha256', storedKey).update(authMessage).digest();
            clientProof = xorBytes(clientKey, clientSignature);
            serverKey = crypto.createHmac('sha256', saltedPassword).update('Server Key').digest();
            serverSignature = crypto.createHmac('sha256', serverKey).update(authMessage).digest();
            state = 3;
            message = JSON.stringify({
              authentication: clientFinalMessageWithoutProof + ',p=' + clientProof.toString('base64')
            });
            nullbyte = new Buffer('\0', 'binary');
            connection.rawSocket.write(Buffer.concat([new Buffer(message.toString()), nullbyte]));
          } else if (state === 3) {
            if (!serverReply.success) {
              handshakeError(serverReply.error_code, serverReply.error);
              return;
            }
            firstEquals = serverReply.authentication.indexOf('=');
            v = serverReply.authentication.slice(firstEquals + 1);
            if (!compareDigest(v, serverSignature.toString('base64'))) {
              throw new errors.ReqlAuthError('Invalid server signature');
            }
            state = 4;
            connection.rawSocket.removeListener('data', handshakeCallback);
            connection.rawSocket.on('data', function(_buf) {
              return connection._data(_buf);
            });
            clearTimeout(timeout);
            connection.emit('connect');
          } else {
            throw new errors.ReqlDriverError('Unexpected handshake state');
          }
        }
      }

      connection.buffer = connection.buffer.slice(j + 1);
      return;
    };

    connection.rawSocket.on('data', handshakeCallback);
    return;
  };
};


/**
 *
 */
class TcpConnection extends Connection {
  constructor(host, callback) {
    if (!TcpConnection.isAvailable()) {
      throw new errors.ReqlDriverError('TCP sockets are not available in this environment');
    }

    super(host, callback);
    if (this.ssl) {
      this.ssl.host = this.host;
      this.ssl.port = this.port;
      this.rawSocket = tls.connect(this.ssl);
    } else {
      this.rawSocket = net.connect(this.port, this.host);
    }
    this.rawSocket.setNoDelay();
    this.rawSocket.setKeepAlive(true);

    let timeout = setTimeout(((function(_this) {
      return function() {
        _this.rawSocket.destroy();
        return _this.emit('error', new errors.ReqlTimeoutError('Could not connect to ' + _this.host + ':' + _this.port + ', operation timed out.'));
      };
    })(this)), this.timeout * 1000);

    this.rawSocket.once('error', (function(_this) {
      return function() {
        return clearTimeout(timeout);
      };
    })(this));

    this.rawSocket.once('connect', connectHandler(this, host, timeout));
    this.rawSocket.on('error', errorHandler(this));
    this.rawSocket.on('close', closeHandler(this));
    this.rawSocket.on('timeout', timeoutHandler(this));
  }
}

TcpConnection.isAvailable = function() {
  return !process.browser;
};

TcpConnection.prototype.clientPort = function() {
  return this.rawSocket.localPort;
};

TcpConnection.prototype.clientAddress = function() {
  return this.rawSocket.localAddress;
};

TcpConnection.prototype.close = varar(0, 2, function(optsOrCallback, callback) {
  let cb, opts;
  if (callback != null) {
    opts = optsOrCallback;
    cb = callback;
  } else if (Object.prototype.toString.call(optsOrCallback) === '[object Object]') {
    opts = optsOrCallback;
    cb = null;
  } else if (typeof optsOrCallback === 'function') {
    opts = {};
    cb = optsOrCallback;
  } else {
    opts = {};
  }

  return new Promise((function(_this) {
    return function(resolve, reject) {
      let wrappedCb = function(error, result) {
        let closeCb = function() {
          if (!!error) return reject(error);
          return resolve(result);
        };

        let cleanupSocket = function() {
          closeCb();
          let ref = _this.rawSocket;
          if (ref != null) {
            ref.removeAllListeners();
          }
          _this.rawSocket = null;
          return _this.emit('close');
        };

        if (_this.rawSocket != null) {
          if (_this.rawSocket.readyState === 'closed') {
            return cleanupSocket();
          }

          let ref = _this.rawSocket;
          if (ref != null) {
            ref.once('close', cleanupSocket);
          }
          return _this.rawSocket.end();
        }

        return process.nextTick(closeCb);
      };

      return Connection.prototype.close.call(_this, opts, wrappedCb);
    };
  })(this)).nodeify(cb);
});

TcpConnection.prototype.cancel = function() {
  this.rawSocket.destroy();
  return Connection.prototype.cancel.call(this);
};

TcpConnection.prototype._writeQuery = function(token, data) {
  let tokenBuf;
  tokenBuf = new Buffer(8);
  tokenBuf.writeUInt32LE(token & 0xFFFFFFFF, 0);
  tokenBuf.writeUInt32LE(Math.floor(token / 0xFFFFFFFF), 4);
  this.rawSocket.write(tokenBuf);
  return this.write(new Buffer(data));
};

TcpConnection.prototype.write = function(chunk) {
  let lengthBuffer;
  lengthBuffer = new Buffer(4);
  lengthBuffer.writeUInt32LE(chunk.length, 0);
  this.rawSocket.write(lengthBuffer);
  return this.rawSocket.write(chunk);
};

module.exports = TcpConnection;
