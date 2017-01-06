const Promise = require('bluebird'),
      Connection = require('./connection');

const net = require('net'),
      tls = require('tls'),
      util = require('../util'),
      err = require('../errors'),
      protodef = require('../proto-def'),
      crypto = require('crypto');

const varar = util.varar;
const protoVersion = protodef.VersionDummy.Version.V1_0,
      protoVersionNumber = 0,
      protoProtocol = protodef.VersionDummy.Protocol.JSON;

let pbkdf2Cache = {};

/**
 *
 */
class TcpConnection extends Connection {
  constructor(host, callback) {
    if (!TcpConnection.isAvailable()) {
      throw new err.ReqlDriverError('TCP sockets are not available in this environment');
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
        return _this.emit('error', new err.ReqlTimeoutError("Could not connect to " + _this.host + ":" + _this.port + ", operation timed out."));
      };
    })(this)), this.timeout * 1000);
    this.rawSocket.once('error', (function(_this) {
      return function() {
        return clearTimeout(timeout);
      };
    })(this));
    this.rawSocket.once('connect', (function(_this) {
      return function() {
        let auth_i, auth_r, auth_salt, client_first_message_bare, compare_digest, handshake_callback, handshake_error, max, message, min, nullbyte, pbkdf2_hmac, protocol, r_string, server_first_message, server_signature, state, version, xor_bytes;
        version = new Buffer(4);
        version.writeUInt32LE(protoVersion, 0);
        protocol = new Buffer(4);
        protocol.writeUInt32LE(protoProtocol, 0);
        r_string = new Buffer(crypto.randomBytes(18)).toString('base64');
        _this.rawSocket.user = host["user"];
        _this.rawSocket.password = host["password"];
        if (_this.rawSocket.user === void 0) {
          _this.rawSocket.user = "admin";
        }
        if (_this.rawSocket.password === void 0) {
          _this.rawSocket.password = "";
        }
        client_first_message_bare = "n=" + _this.rawSocket.user + ",r=" + r_string;
        message = JSON.stringify({
          protocol_version: protoVersionNumber,
          authentication_method: "SCRAM-SHA-256",
          authentication: "n,," + client_first_message_bare
        });
        nullbyte = new Buffer('\0', "binary");
        _this.rawSocket.write(Buffer.concat([version, Buffer(message.toString()), nullbyte]));
        state = 1;
        min = 0;
        max = 0;
        server_first_message = "";
        server_signature = "";
        auth_r = "";
        auth_salt = "";
        auth_i = 0;
        xor_bytes = function(a, b) {
          var i, k, len, ref, res;
          res = [];
          len = Math.min(a.length, b.length);
          for (i = k = 0, ref = len; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
            res.push(a[i] ^ b[i]);
          }
          return new Buffer(res);
        };
        pbkdf2_hmac = function(password, salt, iterations) {
          var c, cache_string, k, mac, ref, t, u;
          cache_string = password.toString("base64") + "," + salt.toString("base64") + "," + iterations.toString();
          if (pbkdf2Cache[cache_string]) {
            return pbkdf2Cache[cache_string];
          }
          mac = crypto.createHmac("sha256", password);
          mac.update(salt);
          mac.update("\x00\x00\x00\x01");
          u = mac.digest();
          t = u;
          for (c = k = 0, ref = iterations - 1; 0 <= ref ? k < ref : k > ref; c = 0 <= ref ? ++k : --k) {
            mac = crypto.createHmac("sha256", password);
            mac.update(t);
            t = mac.digest();
            u = xor_bytes(u, t);
          }
          pbkdf2Cache[cache_string] = u;
          return u;
        };
        compare_digest = function(a, b) {
          var i, k, left, len, ref, result, right;
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
          for (i = k = 0, ref = len; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
            result |= left[i] ^ right[i];
          }
          return result === 0;
        };
        handshake_error = function(code, message) {
          if ((10 <= code && code <= 20)) {
            return _this.emit('error', new err.ReqlAuthError(message));
          } else {
            return _this.emit('error', new err.ReqlDriverError(message));
          }
        };
        handshake_callback = function(buf) {
          var auth_message, authentication, b, client_final_message_without_proof, client_key, client_proof, client_signature, first_equals, i, item, j, json_error, k, l, len1, len2, ref, ref1, salted_password, server_key, server_reply, status_buf, status_str, stored_key, v;
          _this.buffer = Buffer.concat([_this.buffer, buf]);
          j = 0;
          ref = _this.buffer;
          for (i = k = 0, len1 = ref.length; k < len1; i = ++k) {
            b = ref[i];
            if (b === 0) {
              status_buf = _this.buffer.slice(j, i);
              j = i + 1;
              status_str = status_buf.toString();
              try {
                server_reply = JSON.parse(status_str);
              } catch (error1) {
                json_error = error1;
                throw new err.ReqlDriverError(status_str);
              }
              if (state === 1) {
                if (!server_reply.success) {
                  handshake_error(server_reply.error_code, server_reply.error);
                  return;
                }
                min = server_reply.min_protocol_version;
                max = server_reply.max_protocol_version;
                if (min > protoVersionNumber || max < protoVersionNumber) {
                  throw new err.ReqlDriverError("Unsupported protocol version " + protoVersionNumber + ", expected between " + min + " and " + max + ".");
                }
                state = 2;
              } else if (state === 2) {
                if (!server_reply.success) {
                  handshake_error(server_reply.error_code, server_reply.error);
                  return;
                }
                authentication = {};
                server_first_message = server_reply.authentication;
                ref1 = server_first_message.split(",");
                for (l = 0, len2 = ref1.length; l < len2; l++) {
                  item = ref1[l];
                  i = item.indexOf("=");
                  authentication[item.slice(0, i)] = item.slice(i + 1);
                }
                auth_r = authentication.r;
                auth_salt = new Buffer(authentication.s, 'base64');
                auth_i = parseInt(authentication.i);
                if (!(auth_r.substr(0, r_string.length) === r_string)) {
                  throw new err.ReqlAuthError("Invalid nonce from server");
                }
                client_final_message_without_proof = "c=biws,r=" + auth_r;
                salted_password = pbkdf2_hmac(_this.rawSocket.password, auth_salt, auth_i);
                client_key = crypto.createHmac("sha256", salted_password).update("Client Key").digest();
                stored_key = crypto.createHash("sha256").update(client_key).digest();
                auth_message = client_first_message_bare + "," + server_first_message + "," + client_final_message_without_proof;
                client_signature = crypto.createHmac("sha256", stored_key).update(auth_message).digest();
                client_proof = xor_bytes(client_key, client_signature);
                server_key = crypto.createHmac("sha256", salted_password).update("Server Key").digest();
                server_signature = crypto.createHmac("sha256", server_key).update(auth_message).digest();
                state = 3;
                message = JSON.stringify({
                  authentication: client_final_message_without_proof + ",p=" + client_proof.toString("base64")
                });
                nullbyte = new Buffer('\0', "binary");
                _this.rawSocket.write(Buffer.concat([Buffer(message.toString()), nullbyte]));
              } else if (state === 3) {
                if (!server_reply.success) {
                  handshake_error(server_reply.error_code, server_reply.error);
                  return;
                }
                first_equals = server_reply.authentication.indexOf('=');
                v = server_reply.authentication.slice(first_equals + 1);
                if (!compare_digest(v, server_signature.toString("base64"))) {
                  throw new err.ReqlAuthError("Invalid server signature");
                }
                state = 4;
                _this.rawSocket.removeListener('data', handshake_callback);
                _this.rawSocket.on('data', function(buf) {
                  return _this._data(buf);
                });
                clearTimeout(timeout);
                _this.emit('connect');
              } else {
                throw new err.ReqlDriverError("Unexpected handshake state");
              }
            }
          }
          return _this.buffer = _this.buffer.slice(j + 1);
        };
        return _this.rawSocket.on('data', handshake_callback);
      };
    })(this));
    this.rawSocket.on('error', (function(_this) {
      return function(err) {
        return _this.emit('error', err);
      };
    })(this));
    this.rawSocket.on('close', (function(_this) {
      return function() {
        if (_this.isOpen()) {
          _this.close({
            noreplyWait: false
          });
        }
        return _this.emit('close');
      };
    })(this));
    this.rawSocket.on('timeout', (function(_this) {
      return function() {
        _this.open = false;
        return _this.emit('timeout');
      };
    })(this));
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
      let wrappedCb;
      wrappedCb = function(error, result) {
        let cleanupSocket, closeCb, ref;
        closeCb = function() {
          if (error != null) {
            return reject(error);
          } else {
            return resolve(result);
          }
        };
        cleanupSocket = function() {
          let ref;
          closeCb();
          if ((ref = _this.rawSocket) != null) {
            ref.removeAllListeners();
          }
          _this.rawSocket = null;
          return _this.emit("close");
        };
        if (_this.rawSocket != null) {
          if (_this.rawSocket.readyState === 'closed') {
            return cleanupSocket();
          } else {
            if ((ref = _this.rawSocket) != null) {
              ref.once('close', cleanupSocket);
            }
            return _this.rawSocket.end();
          }
        } else {
          return process.nextTick(closeCb);
        }
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
