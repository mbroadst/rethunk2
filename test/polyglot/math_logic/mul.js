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

test('r.expr(1).mul(2)', '2', 'line 4', {}, {})
test('r(-1).mul(-1)', '1', 'line 16', {}, {})
test('r.expr(1.5).mul(4.5)', '6.75', 'line 20', {}, {})
test('r([1,2,3]).mul(3)', '[1,2,3,1,2,3,1,2,3]', 'line 26', {}, {})
test('r.expr(1).mul(2,3,4,5)', '120', 'line 30', {}, {})
test('r(2).mul([1,2,3], 2)', '[1,2,3,1,2,3,1,2,3,1,2,3]', 'line 33', {}, {})
test('r([1,2,3]).mul(2, 2)', '[1,2,3,1,2,3,1,2,3,1,2,3]', 'line 37', {}, {})
test('r(2).mul(2, [1,2,3])', '[1,2,3,1,2,3,1,2,3,1,2,3]', 'line 41', {}, {})
test("r('a').mul(0.8)", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [0])", 'line 47', {}, {})
test("r(1).mul('a')", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [1])", 'line 51', {}, {})
test("r('b').mul('a')", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [0])", 'line 55', {}, {})
test('r([]).mul(1.5)', "err('ReqlQueryLogicError', 'Number not an integer: 1.5', [0])", 'line 59', {}, {})


the_end()
