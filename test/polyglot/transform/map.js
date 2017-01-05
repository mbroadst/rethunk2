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

test('r.range().map(r.range(), function(x, y){return [x, y]}).typeOf()', "'STREAM'", 'line 4', {}, {})
test('r.range().map(r.expr([]), function(x, y){return [x, y]}).typeOf()', "'STREAM'", 'line 9', {}, {})
test('r.expr([]).map(r.expr([]), function(x, y){return [x, y]}).typeOf()', "'ARRAY'", 'line 14', {}, {})
test('r.range(3).map(function(){return 0})', '[0, 0, 0]', 'line 20', {}, {})
test('r.range(3).map(r.range(4), function(){return 0})', '[0, 0, 0]', 'line 25', {}, {})
test('r.expr([1]).map(function(x){return [x]})', '[[1]]', 'line 30', {}, {})
test('r.expr([1]).map(r.expr([1]), function(x, y){return [x, y]})', '[[1, 1]]', 'line 35', {}, {})
test('r.expr([1]).map(r.expr([1]), r.expr([1]), function(x, y, z){return [x, y, z]})', '[[1, 1, 1]]', 'line 40', {}, {})
test('r.expr([1]).map(function(x, y){return [x, y]})', 'err("ReqlQueryLogicError", "The function passed to `map` expects 2 arguments, but 1 sequence was found.", [])', 'line 46', {}, {})
test('r.expr([1]).map(r.expr([1]), function(x){return [x]})', 'err("ReqlQueryLogicError", "The function passed to `map` expects 1 argument, but 2 sequences were found.", [])', 'line 51', {}, {})
test('r.range().map(r.expr([]), function(x, y){return [x, y]})', '[]', 'line 57', {}, {})
test('r.expr([1, 2]).map(r.expr([1, 2, 3, 4]), function(x, y){return [x, y]})', '[[1, 1], [2, 2]]', 'line 62', {}, {})
test('r.range(2).map(r.range(4), function(x, y){return [x, y]})', '[[0, 0], [1, 1]]', 'line 67', {}, {})
test('r.range().map(r.expr([1, 2, 3, 4]), function(x, y){return [x, y]})', '[[0, 1], [1, 2], [2, 3], [3, 4]]', 'line 72', {}, {})
test('r.range(3).map(r.range(5), r.js("(function(x, y){return [x, y];})"))', '[[0, 0], [1, 1], [2, 2]]', 'line 78', {}, {})
test('r.range().map(r.expr(1), function(x, y){return [x, y]})', 'err("ReqlQueryLogicError", "Cannot convert NUMBER to SEQUENCE", [])', 'line 82', {}, {})
test('r.range().map(r.range(), function(x, y){return [x, y]}).count()', 'err("ReqlQueryLogicError", "Cannot use an infinite stream with an aggregation function (`reduce`, `count`, etc.) or coerce it to an array.", [])', 'line 88', {}, {})
test('r.map(r.range(3), function(x){return [x]})', '[[0], [1], [2]]', 'line 94', {}, {})
test('r.map(r.range(3), r.row.add(1))', '[1, 2, 3]', 'line 99', {}, {})
test('r.map(r.range(3), r.range(5), function(x, y){return [x, y]})', '[[0, 0], [1, 1], [2, 2]]', 'line 103', {}, {})

the_end()
