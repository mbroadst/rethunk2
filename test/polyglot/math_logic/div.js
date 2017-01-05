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

test('r(4).div(2)', '2', 'line 4', {}, {})
test('r(-1).div(-2)', '0.5', 'line 16', {}, {})
test('r(4.9).div(0.7)', '4.9 / 0.7', 'line 21', {}, {})
test('r.expr(1).div(2,3,4,5)', '1.0/120', 'line 25', {}, {})
test('r(1).div(0)', "err('ReqlQueryLogicError', 'Cannot divide by zero.', [1])", 'line 30', {}, {})
test('r(2.0).div(0)', "err('ReqlQueryLogicError', 'Cannot divide by zero.', [1])", 'line 31', {}, {})
test('r(3).div(0.0)', "err('ReqlQueryLogicError', 'Cannot divide by zero.', [1])", 'line 32', {}, {})
test('r(4.0).div(0.0)', "err('ReqlQueryLogicError', 'Cannot divide by zero.', [1])", 'line 33', {}, {})
test('r(0).div(0)', "err('ReqlQueryLogicError', 'Cannot divide by zero.', [1])", 'line 34', {}, {})
test('r(0.0).div(0.0)', "err('ReqlQueryLogicError', 'Cannot divide by zero.', [1])", 'line 35', {}, {})
test("r('a').div(0.8)", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [0])", 'line 47', {}, {})
test("r(1).div('a')", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [1])", 'line 51', {}, {})


the_end()
