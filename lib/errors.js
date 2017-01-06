'use strict';

const hasProp = {}.hasOwnProperty;

class ReqlError extends Error {
  constructor(msg, term, frames) {
    super();

    this.name = this.constructor.name;
    this.msg = msg;
    this.frames = frames ? frames.slice(0) : void 0;
    if (term) {
      if (msg[msg.length - 1] === '.') {
        this.message = (msg.slice(0, msg.length - 1)) + ' in:\n' + (ReqlQueryPrinter.prototype.printQuery(term)) + '\n' + (ReqlQueryPrinter.prototype.printCarrots(term, frames));
      } else {
        this.message = msg + ' in:\n' + (ReqlQueryPrinter.prototype.printQuery(term)) + '\n' + (ReqlQueryPrinter.prototype.printCarrots(term, frames));
      }
    } else {
      this.message = '' + msg;
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this);
    }
  }
}

class ReqlCompileError extends ReqlError {}
class ReqlDriverCompileError extends ReqlCompileError {}
class ReqlServerCompileError extends ReqlCompileError {}
class ReqlDriverError extends ReqlError {}
class ReqlAuthError extends ReqlDriverError {}
class ReqlRuntimeError extends ReqlError {}
class ReqlQueryLogicError extends ReqlRuntimeError {}
class ReqlNonExistenceError extends ReqlQueryLogicError {}
class ReqlResourceLimitError extends ReqlRuntimeError {}
class ReqlUserError extends ReqlRuntimeError {}
class ReqlInternalError extends ReqlRuntimeError {}
class ReqlTimeoutError extends ReqlError {}
class ReqlAvailabilityError extends ReqlRuntimeError {}
class ReqlOpFailedError extends ReqlAvailabilityError {}
class ReqlOpIndeterminateError extends ReqlAvailabilityError {}
class ReqlPermissionError extends ReqlAvailabilityError {}

/**
 *
 */
class ReqlQueryPrinter {
  printQuery(term) {
    let tree;
    tree = composeTerm(term);
    return joinTree(tree);
  }

  printCarrots(term, frames) {
    let tree =
      (frames.length === 0) ? [carrotify(composeTerm(term))] : composeCarrots(term, frames);
    return (joinTree(tree)).replace(/[^\^]/g, ' ');
  }
}

const composeTerm = function(term) {
  var arg, args, key, optargs, ref;
  args = (function() {
    var j, len, ref, results;
    ref = term.args;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      arg = ref[j];
      results.push(composeTerm(arg));
    }
    return results;
  })();

  optargs = {};
  ref = term.optargs;
  for (key in ref) {
    if (!hasProp.call(ref, key)) continue;
    arg = ref[key];
    optargs[key] = composeTerm(arg);
  }
  return term.compose(args, optargs);
};

const composeCarrots = function(term, frames) {
  var arg, args, frame, i, key, optargs, ref;
  frame = frames.shift();
  args = (function() {
    var j, len, ref, results;
    ref = term.args;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      arg = ref[i];
      if (frame === i) {
        results.push(composeCarrots(arg, frames));
      } else {
        results.push(composeTerm(arg));
      }
    }
    return results;
  })();

  optargs = {};
  ref = term.optargs;
  for (key in ref) {
    if (!hasProp.call(ref, key)) continue;
    arg = ref[key];
    if (frame === key) {
      optargs[key] = composeCarrots(arg, frames);
    } else {
      optargs[key] = composeTerm(arg);
    }
  }

  if (frame) {
    return term.compose(args, optargs);
  }

  return carrotify(term.compose(args, optargs));
};

let carrotMarker = {};
const carrotify = function(tree) {
  return [carrotMarker, tree];
};

const joinTree = function(tree) {
  let j, len, str, term;
  str = '';
  for (j = 0, len = tree.length; j < len; j++) {
    term = tree[j];
    if (Array.isArray(term)) {
      if (term.length === 2 && term[0] === carrotMarker) {
        str += (joinTree(term[1])).replace(/./g, '^');
      } else {
        str += joinTree(term);
      }
    } else {
      str += term;
    }
  }

  return str;
};

module.exports = {
  ReqlError: ReqlError,
  ReqlCompileError: ReqlCompileError,
  RqlCompileError: ReqlCompileError,
  ReqlServerCompileError: ReqlServerCompileError,
  ReqlDriverCompileError: ReqlDriverCompileError,
  RqlClientError: ReqlDriverError,
  ReqlRuntimeError: ReqlRuntimeError,
  RqlRuntimeError: ReqlRuntimeError,
  RqlServerError: ReqlRuntimeError,
  ReqlQueryLogicError: ReqlQueryLogicError,
  ReqlNonExistenceError: ReqlNonExistenceError,
  ReqlResourceLimitError: ReqlResourceLimitError,
  ReqlUserError: ReqlUserError,
  ReqlInternalError: ReqlInternalError,
  ReqlTimeoutError: ReqlTimeoutError,
  ReqlAvailabilityError: ReqlAvailabilityError,
  ReqlOpFailedError: ReqlOpFailedError,
  ReqlOpIndeterminateError: ReqlOpIndeterminateError,
  ReqlPermissionError: ReqlPermissionError,
  ReqlDriverError: ReqlDriverError,
  RqlDriverError: ReqlDriverError,
  ReqlAuthError: ReqlAuthError,
  printQuery: ReqlQueryPrinter.prototype.printQuery
};
