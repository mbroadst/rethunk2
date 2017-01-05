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

test('r.floor(1.0).typeOf()', '"NUMBER"', 'line 3', {}, {})
test('r.floor(1.0)', '1.0', 'line 5', {}, {})
test('r.expr(1.0).floor()', '1.0', 'line 7', {}, {})
test('r.floor(0.5)', '0.0', 'line 10', {}, {})
test('r.floor(1.0)', '1.0', 'line 12', {}, {})
test('r.floor(1.5)', '1.0', 'line 14', {}, {})
test('r.floor(-0.5)', '-1.0', 'line 16', {}, {})
test('r.floor(-1.0)', '-1.0', 'line 18', {}, {})
test('r.floor(-1.5)', '-2.0', 'line 20', {}, {})
test("r.expr('X').floor()", 'err("ReqlQueryLogicError", "Expected type NUMBER but found STRING.", [])', 'line 23', {}, {})
test('r.ceil(1.0).typeOf()', '"NUMBER"', 'line 27', {}, {})
test('r.ceil(1.0)', '1.0', 'line 29', {}, {})
test('r.expr(1.0).ceil()', '1.0', 'line 31', {}, {})
test('r.ceil(0.5)', '1.0', 'line 34', {}, {})
test('r.ceil(1.0)', '1.0', 'line 36', {}, {})
test('r.ceil(1.5)', '2.0', 'line 38', {}, {})
test('r.ceil(-0.5)', '0.0', 'line 40', {}, {})
test('r.ceil(-1.0)', '-1.0', 'line 42', {}, {})
test('r.ceil(-1.5)', '-1.0', 'line 44', {}, {})
test("r.expr('X').ceil()", 'err("ReqlQueryLogicError", "Expected type NUMBER but found STRING.", [])', 'line 47', {}, {})
test('r.round(1.0).typeOf()', '"NUMBER"', 'line 51', {}, {})
test('r.round(1.0)', '1.0', 'line 53', {}, {})
test('r.expr(1.0).round()', '1.0', 'line 55', {}, {})
test('r.round(0.5)', '1.0', 'line 58', {}, {})
test('r.round(-0.5)', '-1.0', 'line 60', {}, {})
test('r.round(0.0)', '0.0', 'line 63', {}, {})
test('r.round(1.0)', '1.0', 'line 65', {}, {})
test('r.round(10.0)', '10.0', 'line 67', {}, {})
test('r.round(1000000000.0)', '1000000000.0', 'line 69', {}, {})
test('r.round(1e20)', '1e20', 'line 71', {}, {})
test('r.round(-1.0)', '-1.0', 'line 74', {}, {})
test('r.round(-10.0)', '-10.0', 'line 76', {}, {})
test('r.round(-1000000000.0)', '-1000000000.0', 'line 78', {}, {})
test('r.round(-1e20)', '-1e20', 'line 80', {}, {})
test('r.round(0.1)', '0.0', 'line 83', {}, {})
test('r.round(1.1)', '1.0', 'line 85', {}, {})
test('r.round(10.1)', '10.0', 'line 87', {}, {})
test('r.round(1000000000.1)', '1000000000.0', 'line 89', {}, {})
test('r.round(-1.1)', '-1.0', 'line 92', {}, {})
test('r.round(-10.1)', '-10.0', 'line 94', {}, {})
test('r.round(-1000000000.1)', '-1000000000.0', 'line 96', {}, {})
test('r.round(0.9)', '1.0', 'line 99', {}, {})
test('r.round(9.9)', '10.0', 'line 101', {}, {})
test('r.round(999999999.9)', '1000000000.0', 'line 103', {}, {})
test('r.round(-0.9)', '-1.0', 'line 106', {}, {})
test('r.round(-9.9)', '-10.0', 'line 108', {}, {})
test('r.round(-999999999.9)', '-1000000000.0', 'line 110', {}, {})
test("r.expr('X').round()", 'err("ReqlQueryLogicError", "Expected type NUMBER but found STRING.", [])', 'line 113', {}, {})


the_end()
