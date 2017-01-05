#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table_check()

test('r.expr([])', '[]', 'line 4', {}, {})
test('r([])', '[]', 'line 5', {}, {})
test('r([1])', '[1]', 'line 10', {}, {})
test('r([1,2,3,4,5])', '[1,2,3,4,5]', 'line 15', {}, {})
test('r.expr([]).typeOf()', "'ARRAY'", 'line 19', {}, {})
test("r.expr([1, 2]).coerceTo('string')", "'[1,2]'", 'line 24', {}, {})
test("r.expr([1, 2]).coerceTo('STRING')", "'[1,2]'", 'line 25', {}, {})
test("r.expr([1, 2]).coerceTo('array')", '[1, 2]', 'line 28', {}, {})
test("r.expr([1, 2]).coerceTo('number')", "err('ReqlQueryLogicError', 'Cannot coerce ARRAY to NUMBER.', [0])", 'line 31', {}, {})
test("r.expr([['a', 1], ['b', 2]]).coerceTo('object')", "({'a':1,'b':2})", 'line 34', {}, {})
test("r.expr([[]]).coerceTo('object')", "err('ReqlQueryLogicError', 'Expected array of size 2, but got size 0.')", 'line 37', {}, {})
test("r.expr([['1',2,3]]).coerceTo('object')", "err('ReqlQueryLogicError', 'Expected array of size 2, but got size 3.')", 'line 40', {}, {})
test('r.expr([r.expr(1)])', '[1]', 'line 44', {}, {})
test('r.expr([1,3,4]).insertAt(1, 2)', '[1,2,3,4]', 'line 47', {}, {})
test('r.expr([2,3]).insertAt(0, 1)', '[1,2,3]', 'line 49', {}, {})
test('r.expr([1,2,3]).insertAt(-1, 4)', '[1,2,3,4]', 'line 51', {}, {})
test('r.expr([1,2,3]).insertAt(3, 4)', '[1,2,3,4]', 'line 53', {}, {})
test('r.expr(3).do(function (x) { return r.expr([1,2,3]).insertAt(x, 4); })', "", 'line 56', {}, {})
test('r.expr([1,2,3]).insertAt(4, 5)', "err('ReqlNonExistenceError', 'Index `4` out of bounds for array of size: `3`.', [0])", 'line 59', {}, {})
test('r.expr([1,2,3]).insertAt(-5, -1)', "err('ReqlNonExistenceError', 'Index out of bounds: -5', [0])", 'line 61', {}, {})
test('r.expr([1,2,3]).insertAt(1.5, 1)', "err('ReqlQueryLogicError', 'Number not an integer: 1.5', [0])", 'line 63', {}, {})
test('r.expr([1,2,3]).insertAt(null, 1)', "err('ReqlNonExistenceError', 'Expected type NUMBER but found NULL.', [0])", 'line 65', {}, {})
test('r.expr([1,4]).spliceAt(1, [2,3])', '[1,2,3,4]', 'line 68', {}, {})
test('r.expr([3,4]).spliceAt(0, [1,2])', '[1,2,3,4]', 'line 70', {}, {})
test('r.expr([1,2]).spliceAt(2, [3,4])', '[1,2,3,4]', 'line 72', {}, {})
test('r.expr([1,2]).spliceAt(-1, [3,4])', '[1,2,3,4]', 'line 74', {}, {})
test('r.expr(2).do(function (x) { return r.expr([1,2]).spliceAt(x, [3,4]); })', "", 'line 77', {}, {})
test('r.expr([1,2]).spliceAt(3, [3,4])', "err('ReqlNonExistenceError', 'Index `3` out of bounds for array of size: `2`.', [0])", 'line 80', {}, {})
test('r.expr([1,2]).spliceAt(-4, [3,4])', "err('ReqlNonExistenceError', 'Index out of bounds: -4', [0])", 'line 82', {}, {})
test('r.expr([1,2,3]).spliceAt(1.5, [1])', "err('ReqlQueryLogicError', 'Number not an integer: 1.5', [0])", 'line 84', {}, {})
test('r.expr([1,2,3]).spliceAt(null, [1])', "err('ReqlNonExistenceError', 'Expected type NUMBER but found NULL.', [0])", 'line 86', {}, {})
test('r.expr([1,4]).spliceAt(1, 2)', "err('ReqlQueryLogicError', 'Expected type ARRAY but found NUMBER.', [0])", 'line 88', {}, {})
test('r.expr([1,2,3,4]).deleteAt(0)', '[2,3,4]', 'line 91', {}, {})
test('r.expr(0).do(function (x) { return r.expr([1,2,3,4]).deleteAt(x); })', "", 'line 94', {}, {})
test('r.expr([1,2,3,4]).deleteAt(-1)', '[1,2,3]', 'line 97', {}, {})
test('r.expr([1,2,3,4]).deleteAt(1,3)', '[1,4]', 'line 99', {}, {})
test('r.expr([1,2,3,4]).deleteAt(4,4)', '[1,2,3,4]', 'line 101', {}, {})
test('r.expr([]).deleteAt(0,0)', '[]', 'line 103', {}, {})
test('r.expr([1,2,3,4]).deleteAt(1,-1)', '[1,4]', 'line 105', {}, {})
test('r.expr([1,2,3,4]).deleteAt(4)', "err('ReqlNonExistenceError', 'Index `4` out of bounds for array of size: `4`.', [0])", 'line 107', {}, {})
test('r.expr([1,2,3,4]).deleteAt(-5)', "err('ReqlNonExistenceError', 'Index out of bounds: -5', [0])", 'line 109', {}, {})
test('r.expr([1,2,3]).deleteAt(1.5)', "err('ReqlQueryLogicError', 'Number not an integer: 1.5', [0])", 'line 111', {}, {})
test('r.expr([1,2,3]).deleteAt(null)', "err('ReqlNonExistenceError', 'Expected type NUMBER but found NULL.', [0])", 'line 113', {}, {})
test('r.expr([0,2,3]).changeAt(0, 1)', '[1,2,3]', 'line 116', {}, {})
test('r.expr(1).do(function (x) { return r.expr([0,2,3]).changeAt(0,x); })', "", 'line 119', {}, {})
test('r.expr([1,0,3]).changeAt(1, 2)', '[1,2,3]', 'line 122', {}, {})
test('r.expr([1,2,0]).changeAt(2, 3)', '[1,2,3]', 'line 124', {}, {})
test('r.expr([1,2,3]).changeAt(3, 4)', "err('ReqlNonExistenceError', 'Index `3` out of bounds for array of size: `3`.', [0])", 'line 126', {}, {})
test('r.expr([1,2,3,4]).changeAt(-5, 1)', "err('ReqlNonExistenceError', 'Index out of bounds: -5', [0])", 'line 128', {}, {})
test('r.expr([1,2,3]).changeAt(1.5, 1)', "err('ReqlQueryLogicError', 'Number not an integer: 1.5', [0])", 'line 130', {}, {})
test('r.expr([1,2,3]).changeAt(null, 1)', "err('ReqlNonExistenceError', 'Expected type NUMBER but found NULL.', [0])", 'line 132', {}, {})


the_end()
