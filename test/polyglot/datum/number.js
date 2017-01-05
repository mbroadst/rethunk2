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

test('r(1)', '1', 'line 8', {}, {})
test('r.expr(1)', '1', 'line 9', {}, {})
test('r(-1)', '-1', 'line 17', {}, {})
test('r.expr(-1)', '-1', 'line 18', {}, {})
test('r(0)', '0', 'line 26', {}, {})
test('r.expr(0)', '0', 'line 27', {}, {})
test('r(1.0)', '1.0', 'line 37', {}, {})
test('r.expr(1.0)', '1.0', 'line 38', {}, {})
test('r(1.5)', '1.5', 'line 46', {}, {})
test('r.expr(1.5)', '1.5', 'line 47', {}, {})
test('r(-0.5)', '-0.5', 'line 55', {}, {})
test('r.expr(-0.5)', '-0.5', 'line 56', {}, {})
test('r(67498.89278)', '67498.89278', 'line 64', {}, {})
test('r.expr(67498.89278)', '67498.89278', 'line 65', {}, {})
test('r(1234567890)', '1234567890', 'line 75', {}, {})
test('r.expr(1234567890)', '1234567890', 'line 76', {}, {})
test('r.expr(-73850380122423)', '-73850380122423', 'line 85', {}, {})
test('r(-73850380122423)', '-73850380122423', 'line 86', {}, {})
test('r.expr(1234567890123456789012345678901234567890)', '1234567890123456789012345678901234567890', 'line 98', {}, {})
test('r.expr(123.4567890123456789012345678901234567890)', '123.4567890123456789012345678901234567890', 'line 100', {}, {})
test('r.expr(1).typeOf()', "'NUMBER'", 'line 103', {}, {})
test("r.expr(1).coerceTo('string')", "'1'", 'line 107', {}, {})
test("r.expr(1).coerceTo('number')", '1', 'line 110', {}, {})


the_end()
