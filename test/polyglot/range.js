#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('./common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table_check()

test('r.range().typeOf()', "'STREAM'", 'line 3', {}, {})
test('r.range().limit(4)', '[0, 1, 2, 3]', 'line 6', {}, {})
test('r.range(4)', '[0, 1, 2, 3]', 'line 9', {}, {})
test('r.range(2, 5)', '[2, 3, 4]', 'line 12', {}, {})
test('r.range(0)', '[]', 'line 15', {}, {})
test('r.range(5, 2)', '[]', 'line 18', {}, {})
test('r.range(-5, -2)', '[-5, -4, -3]', 'line 21', {}, {})
test('r.range(-5, 2)', '[-5, -4, -3, -2, -1, 0, 1]', 'line 24', {}, {})
test('r.range(2, 5, 8)', 'err("ReqlCompileError", "Expected between 0 and 2 arguments but found 3.", [])', 'line 27', {}, {})
test('r.range("foo")', 'err("ReqlQueryLogicError", "Expected type NUMBER but found STRING.", [])', 'line 30', {}, {})
test('r.range(9007199254740994)', 'err_regex("ReqlQueryLogicError", "Number not an integer \\\\(>2\\\\^53\\\\). 9007199254740994", [])', 'line 34', {}, {})
test('r.range(-9007199254740994)', 'err_regex("ReqlQueryLogicError", "Number not an integer \\\\(<-2\\\\^53\\\\). -9007199254740994", [])', 'line 37', {}, {})
test('r.range(0.5)', 'err_regex("ReqlQueryLogicError", "Number not an integer. 0\\\\.5", [])', 'line 40', {}, {})
test('r.range().count()', 'err("ReqlQueryLogicError", "Cannot use an infinite stream with an aggregation function (`reduce`, `count`, etc.) or coerce it to an array.", [])', 'line 43', {}, {})
test('r.range().coerceTo("ARRAY")', 'err("ReqlQueryLogicError", "Cannot use an infinite stream with an aggregation function (`reduce`, `count`, etc.) or coerce it to an array.", [])', 'line 46', {}, {})
test('r.range().coerceTo("OBJECT")', 'err("ReqlQueryLogicError", "Cannot use an infinite stream with an aggregation function (`reduce`, `count`, etc.) or coerce it to an array.", [])', 'line 49', {}, {})
test('r.range(4).count()', '4', 'line 52', {}, {})

the_end()
