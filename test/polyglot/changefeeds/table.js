#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_changefeeds_table_js7_2', 'test')
setup_table_check()

test('tbl.changes()', "", 'line 9', {}, {'variable': 'all'})
test("tbl.insert([{'id':1}, {'id':2}])", "partial({'errors':0, 'inserted':2})", 'line 15', {}, {})
test('fetch(all, 2)', "bag([{'old_val':null, 'new_val':{'id':1}}, {'old_val':null, 'new_val':{'id':2}}])", 'line 17', {}, {})
test("tbl.get(1).update({'version':1})", "partial({'errors':0, 'replaced':1})", 'line 22', {}, {})
test('fetch(all, 1)', "[{'old_val':{'id':1}, 'new_val':{'id':1, 'version':1}}]", 'line 24', {}, {})
test('tbl.get(1).delete()', "partial({'errors':0, 'deleted':1})", 'line 29', {}, {})
test('fetch(all, 1)', "[{'old_val':{'id':1, 'version':1}, 'new_val':null}]", 'line 31', {}, {})
test("tbl.changes().pluck({'new_val':['version']})", "", 'line 36', {}, {'variable': 'pluck'})
test("tbl.insert([{'id':5, 'version':5}])", "partial({'errors':0, 'inserted':1})", 'line 37', {}, {})
test('fetch(pluck, 1)', "[{'new_val':{'version':5}}]", 'line 39', {}, {})
test("tbl.changes().orderBy('id')", 'err(\'ReqlQueryLogicError\', "Cannot call a terminal (`reduce`, `count`, etc.) on an infinite stream (such as a changefeed).")', 'line 44', {}, {})
test('tbl.changes()', "", 'line 59', {'changefeed_queue_size': '100'}, {'variable': 'overflow'})
test('tbl.insert(r.range(200).map(function(x) { return({}); }))', "", 'line 63', {}, {})
test('fetch(overflow, 90)', "partial([{'error': regex('Changefeed cache over array size limit, skipped \\d+ elements.')}])", 'line 66', {}, {})
define("r.db('rethinkdb').table('_debug_scratch')", 'vtbl')
test('vtbl.changes()', "", 'line 72', {}, {'variable': 'allVirtual'})
test("vtbl.insert([{'id':1}, {'id':2}])", "partial({'errors':0, 'inserted':2})", 'line 76', {}, {})
test('fetch(allVirtual, 2)', "bag([{'old_val':null, 'new_val':{'id':1}}, {'old_val':null, 'new_val':{'id':2}}])", 'line 78', {}, {})
test("vtbl.get(1).update({'version':1})", "partial({'errors':0, 'replaced':1})", 'line 83', {}, {})
test('fetch(allVirtual, 1)', "[{'old_val':{'id':1}, 'new_val':{'id':1, 'version':1}}]", 'line 85', {}, {})
test('vtbl.get(1).delete()', "partial({'errors':0, 'deleted':1})", 'line 90', {}, {})
test('fetch(allVirtual, 1)', "[{'old_val':{'id':1, 'version':1}, 'new_val':null}]", 'line 92', {}, {})
test("vtbl.changes().pluck({'new_val':['version']})", "", 'line 97', {}, {'variable': 'vpluck'})
test("vtbl.insert([{'id':5, 'version':5}])", "partial({'errors':0, 'inserted':1})", 'line 98', {}, {})
test('fetch(vpluck, 1)', "[{'new_val':{'version':5}}]", 'line 100', {}, {})


the_end()
