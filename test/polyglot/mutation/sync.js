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

test("r.db('test').tableCreate('test1')", "partial({'tables_created':1})", 'line 5', {}, {})
test("r.db('test').tableCreate('test1soft')", "partial({'tables_created':1})", 'line 7', {}, {})
test("r.db('test').table('test1soft').config().update({'durability':'soft'})", "({'skipped':0, 'deleted':0, 'unchanged':0, 'errors':0, 'replaced':1, 'inserted':0})", 'line 9', {}, {})
define("r.db('test').table('test1')", 'tbl')
define("r.db('test').table('test1soft')", 'tblSoft')
test("tbl.indexCreate('x')", "partial({'created':1})", 'line 13', {}, {})
test("tbl.indexWait('x').pluck('index', 'ready')", "[{'ready':true, 'index':'x'}]", 'line 15', {}, {})
test('tbl.sync()', "({'synced':1})", 'line 19', {}, {})
test('tblSoft.sync()', "({'synced':1})", 'line 21', {}, {})
test('tbl.sync()', "({'synced':1})", 'line 23', {'durability': '"soft"'}, {})
test('tbl.sync()', "({'synced':1})", 'line 27', {'durability': '"hard"'}, {})
test('tbl.between(1, 2).sync()', "err('ReqlQueryLogicError', 'Expected type TABLE but found TABLE_SLICE:', [1])", 'line 33', {}, {})
test('r.expr(1).sync()', 'err("ReqlQueryLogicError", \'Expected type TABLE but found DATUM:\', [1])', 'line 39', {}, {})
test("tbl.orderBy({index:'x'}).sync()", 'err("ReqlQueryLogicError", \'Expected type TABLE but found TABLE_SLICE:\', [1])', 'line 43', {}, {})
test("r.db('test').tableDrop('test1')", "partial({'tables_dropped':1})", 'line 48', {}, {})
test("r.db('test').tableDrop('test1soft')", "partial({'tables_dropped':1})", 'line 50', {}, {})


the_end()
