#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_2697_js7_2', 'test')
setup_table_check()

define('r.expr([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])', 'tenL')
test("tbl.insert({'id':1, 'a':r.expr(tenL).concatMap(function(l) { return tenL }).concatMap(function(l) { return tenL }).concatMap(function(l) { return tenL }).concatMap(function(l) { return tenL })}).pluck('first_error', 'inserted')", "({'inserted':1})", 'line 6', {}, {})
test("tbl.get(1).replace({'id':1, 'a':r.row('a').spliceAt(0, [2])}).pluck('first_error')", "({'first_error':'Array over size limit `100000`.'})", 'line 11', {}, {})
test("tbl.get(1)('a').count()", '100000', 'line 15', {}, {})
test("tbl.get(1).replace({'id':1, 'a':r.row('a').insertAt(0, [2])}).pluck('first_error')", "({'first_error':'Array over size limit `100000`.'})", 'line 18', {}, {})
test("tbl.get(1)('a').count()", '100000', 'line 22', {}, {})
test('r.expr([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).concatMap(function(l) { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }).concatMap(function(l) { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }).concatMap(function(l) { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }).concatMap(function(l) { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }).spliceAt(0, [1]).count()', 'err("ReqlResourceLimitError", "Array over size limit `100000`.", [])', 'line 24', {}, {})
test('r.expr([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).concatMap(function(l) { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }).concatMap(function(l) { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }).concatMap(function(l) { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }).concatMap(function(l) { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }).insertAt(0, [1]).count()', 'err("ReqlResourceLimitError", "Array over size limit `100000`.", [])', 'line 28', {}, {})


the_end()
