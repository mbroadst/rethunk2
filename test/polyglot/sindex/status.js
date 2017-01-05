#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl2', 'polyglot_sindex_status_js7_2', 'test')
setup_table_check()

test('tbl2.indexCreate("a")', "({'created':1})", 'line 7', {}, {})
test('tbl2.indexCreate("b")', "({'created':1})", 'line 9', {}, {})
test('tbl2.indexStatus().count()', '2', 'line 12', {}, {})
test('tbl2.indexStatus("a").count()', '1', 'line 14', {}, {})
test('tbl2.indexStatus("b").count()', '1', 'line 16', {}, {})
test('tbl2.indexStatus("a", "b").count()', '2', 'line 18', {}, {})
test('tbl2.indexDrop("a")', "({'dropped':1})", 'line 21', {}, {})
test('tbl2.indexDrop("b")', "({'dropped':1})", 'line 23', {}, {})
test("tbl2.insert(r.range(0, 5000).map(function(row){ return {'a':row}; }))", "partial({'inserted':5000})", 'line 30', {}, {})
test('tbl2.indexCreate("foo")', "({'created':1})", 'line 33', {}, {})
test('tbl2.indexCreate("bar", {multi:true})', "({'created':1})", 'line 37', {}, {})
test('tbl2.indexStatus().map(function (x) { return x("progress").lt(1); })', '[true, true]', 'line 46', {}, {})
test("tbl2.indexWait()('ready')", '([true, true])', 'line 51', {}, {})
test('tbl2.indexCreate("quux")', "({'created':1})", 'line 63', {}, {})
test('tbl2.indexStatus("quux").do(function (x) { return x.nth(0)("index").eq("quux").and(x.nth(0)("progress").lt(1)); })', 'true', 'line 68', {}, {})
test('tbl2.indexWait("quux").pluck(\'index\', \'ready\')', "([{'index':'quux', 'ready':true}])", 'line 71', {}, {})
test('tbl2.indexWait("quux").nth(0).getField(\'function\').typeOf()', '("PTYPE<BINARY>")', 'line 74', {}, {})


the_end()
