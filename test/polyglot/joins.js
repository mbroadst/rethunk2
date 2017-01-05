#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('./common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_joins_js7_2', 'test')
setup_table('tbl2', 'polyglot_joins_js7_2_tbl1', 'test')
setup_table('senders', 'polyglot_joins_js7_2_tbl2', 'test')
setup_table('receivers', 'polyglot_joins_js7_2_tbl3', 'test')
setup_table('messages', 'polyglot_joins_js7_2_tbl4', 'test')
setup_table('otbl', 'polyglot_joins_js7_2_tbl5', 'test')
setup_table('otbl2', 'polyglot_joins_js7_2_tbl6', 'test')
setup_table_check()

test("r.db('test').tableCreate('test3', {'primaryKey':'foo'})", "partial({'tables_created':1})", 'line 9', {}, {})
define("r.db('test').table('test3')", 'tbl3')
test("tbl.insert(r.range(0, 100).map(function (row) { return {'id':row, 'a':row.mod(4)}; }))", "partial({'errors':0, 'inserted':100})", 'line 15', {}, {})
test("tbl2.insert(r.range(0, 100).map(function (row) { return {'id':row, 'b':row.mod(4)}; }))", "partial({'errors':0, 'inserted':100})", 'line 20', {}, {})
test("tbl3.insert(r.range(0, 100).map(function (row) { return {'foo':row, 'b':row.mod(4)}; }))", "partial({'errors':0, 'inserted':100})", 'line 25', {}, {})
define("tbl.innerJoin(tbl2, function(x, y) { return x('a').eq(y('b')); }).zip()", 'ij')
test('ij.count()', '2500', 'line 37', {}, {})
test("ij.filter(function(row) { return row('a').ne(row('b')); }).count()", '0', 'line 40', {}, {})
define("tbl.outerJoin(tbl2, function(x, y) { return x('a').eq(y('b')); }).zip()", 'oj')
test('oj.count()', '2500', 'line 49', {}, {})
test("oj.filter(function(row) { return row('a').ne(row('b')); }).count()", '0', 'line 52', {}, {})
test("tbl.eqJoin('a', tbl2).zip().count()", '100', 'line 65', {}, {})
test("tbl.eqJoin('fake', tbl2).zip().count()", '0', 'line 68', {}, {})
test("tbl.eqJoin(function(x) { return x('a'); }, tbl2).zip().count()", '100', 'line 73', {}, {})
test("tbl.eqJoin(function(x) { return x('fake'); }, tbl2).zip().count()", '0', 'line 78', {}, {})
test('tbl.eqJoin(function(x) { return null; }, tbl2).zip().count()', '0', 'line 83', {}, {})
test("tbl.eqJoin(function(x) { return x('a'); }, tbl2).count()", '100', 'line 88', {}, {})
test("tbl.eqJoin('a', tbl3).zip().count()", '100', 'line 92', {}, {})
test("tbl.eqJoin(function(x) { return x('a'); }, tbl3).count()", '100', 'line 97', {}, {})
test("tbl.eqJoin(r.row('a'), tbl2).count()", '100', 'line 102', {}, {})
define("r.expr([{'a':1},{'a':2},{'a':3}])", 'left')
define("r.expr([{'b':2},{'b':3}])", 'right')
test("left.innerJoin(right, function(l, r) { return l('a').eq(r('b')); }).zip()", "[{'a':2,'b':2},{'a':3,'b':3}]", 'line 110', {}, {})
test("left.outerJoin(right, function(l, r) { return l('a').eq(r('b')); }).zip()", "[{'a':1},{'a':2,'b':2},{'a':3,'b':3}]", 'line 116', {}, {})
test("r.db('test').tableDrop('test3')", "partial({'tables_dropped':1})", 'line 132', {}, {})

the_end()
