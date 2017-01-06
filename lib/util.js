'use strict';

const slice = [].slice;
const err = require('./errors'),
      protodef = require('./proto-def'),
      protoErrorType = protodef.Response.ErrorType;

const plural = function(number) {
  return (number === 1) ? '' : 's';
};

module.exports.ar = function(fun) {
  return function() {
    let args = arguments.length >= 1 ? slice.call(arguments, 0) : [];
    if (args.length !== fun.length) {
      throw new err.ReqlDriverCompileError(`Expected ${fun.length} argument${plural(fun.length)} but found ${args.length}.`);
    }

    return fun.apply(this, args);
  };
};

module.exports.varar = function(min, max, fun) {
  return function() {
    let args = arguments.length >= 1 ? slice.call(arguments, 0) : [];
    if (((min !== null && min !== undefined) && args.length < min) || ((max !== null && max !== undefined) && args.length > max)) {
      if ((min !== null && min !== undefined) && (max === null || max === undefined)) {
        throw new err.ReqlDriverCompileError(`Expected ${min} or more arguments but found ${args.length}.`);
      }
      if ((max !== null && max !== undefined) && (min === null || max === undefined)) {
        throw new err.ReqlDriverCompileError(`Expected ${max} or fewer arguments but found ${args.length}.`);
      }
      throw new err.ReqlDriverCompileError(`Expected between ${min} and ${max} arguments but found ${args.length}.`);
    }

    return fun.apply(this, args);
  };
};

module.exports.aropt = function(fun) {
  return function() {
    let args, expectedPosArgs, numPosArgs, perhapsOptDict;
    args = arguments.length >= 1 ? slice.call(arguments, 0) : [];
    expectedPosArgs = fun.length - 1;
    perhapsOptDict = args[expectedPosArgs];
    if (!!perhapsOptDict && (Object.prototype.toString.call(perhapsOptDict) !== '[object Object]')) {
      perhapsOptDict = null;
    }

    numPosArgs = args.length - (!!perhapsOptDict ? 1 : 0);
    if (expectedPosArgs !== numPosArgs) {
      throw new err.ReqlDriverCompileError(`Expected ${expectedPosArgs} argument${plural(expectedPosArgs)} (not including options) but found ${numPosArgs}.`);
    }

    return fun.apply(this, args);
  };
};

module.exports.toArrayBuffer = function(nodeBuffer) {
  let arr, i, j, len, value;
  arr = new Uint8Array(new ArrayBuffer(nodeBuffer.length));
  for (i = j = 0, len = nodeBuffer.length; j < len; i = ++j) {
    value = nodeBuffer[i];
    arr[i] = value;
  }

  return arr.buffer;
};

module.exports.fromCamelCase = function(token) {
  return token.replace(/[A-Z]/g, function(match) {
    return '_' + match.toLowerCase();
  });
};

module.exports.toCamelCase = function(token) {
  return token.replace(/_[a-z]/g, function(match) {
    return match[1].toUpperCase();
  });
};

const convertPseudotype = function(obj, opts) {
  if (obj.$reql_type$ === 'TIME') {
    if (opts.timeFormat === 'native' || opts.timeFormat === undefined) {
      if (!obj.hasOwnProperty('epoch_time')) {
        throw new err.ReqlDriverError('pseudo-type TIME ' + obj + " object missing expected field 'epoch_time'.");
      }

      return new Date(obj.epoch_time * 1000);
    }
  } else if (obj.$reql_type$ === 'GROUPED_DATA') {
    if (opts.groupFormat === 'native' || opts.groupFormat === undefined) {
      let ref = obj.data;
      let results = [];
      for (let j = 0, len = ref.length; j < len; j++) {
        results.push({ group: ref[j][0], reduction: ref[j][1] });
      }
      return results;
    }

    // opts.groupFormat === 'raw' falls through below
    if (opts.groupFormat !== 'raw') {
      throw new err.ReqlDriverError('Unknown groupFormat run option ' + opts.groupFormat + '.');
    }
  } else if (obj.$reql_type$ === 'BINARY') {
    if (opts.binaryFormat === 'native' || opts.binaryFormat === undefined) {
      if (!obj.hasOwnProperty('data')) {
        throw new err.ReqlDriverError("pseudo-type BINARY object missing expected field 'data'.");
      }

      return new Buffer(obj.data, 'base64');
    }

    // opts.binaryFormat === 'raw' falls through below
    if (opts.binaryFormat !== 'raw') {
      throw new err.ReqlDriverError('Unknown binaryFormat run option ' + opts.binaryFormat + '.');
    }
  }

  return obj;
};

const recursivelyConvertPseudotype = function(obj, opts) {
  let i, j, key, len, value;
  if (Array.isArray(obj)) {
    for (i = j = 0, len = obj.length; j < len; i = ++j) {
      value = obj[i];
      obj[i] = recursivelyConvertPseudotype(value, opts);
    }
  } else if (obj && typeof obj === 'object') {
    for (key in obj) {
      value = obj[key];
      obj[key] = recursivelyConvertPseudotype(value, opts);
    }
    obj = convertPseudotype(obj, opts);
  }
  return obj;
};

const mkAtom = function(response, opts) {
  return recursivelyConvertPseudotype(response.r[0], opts);
};

const mkSeq = function(response, opts) {
  return recursivelyConvertPseudotype(response.r, opts);
};

const mkErr = function(ErrClass, response, root) {
  return new ErrClass(mkAtom(response), root, response.b);
};

const errorClass = function(errorType) {
  switch (errorType) {
  case protoErrorType.QUERY_LOGIC:
    return err.ReqlQueryLogicError;
  case protoErrorType.NON_EXISTENCE:
    return err.ReqlNonExistenceError;
  case protoErrorType.RESOURCE_LIMIT:
    return err.ReqlResourceLimitError;
  case protoErrorType.USER:
    return err.ReqlUserError;
  case protoErrorType.INTERNAL:
    return err.ReqlInternalError;
  case protoErrorType.OP_FAILED:
    return err.ReqlOpFailedError;
  case protoErrorType.OP_INDETERMINATE:
    return err.ReqlOpIndeterminateError;
  case protoErrorType.PERMISSION_ERROR:
    return err.ReqlPermissionError;
  default:
    return err.ReqlRuntimeError;
  }
};

module.exports.recursivelyConvertPseudotype = recursivelyConvertPseudotype;
module.exports.mkAtom = mkAtom;
module.exports.mkSeq = mkSeq;
module.exports.mkErr = mkErr;
module.exports.errorClass = errorClass;
module.exports.inherits = require('util').inherits;
