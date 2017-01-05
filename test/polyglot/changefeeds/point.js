#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_changefeeds_point_js7_2', 'test')
setup_table_check()

test('tbl.get(1).changes({includeInitial:true})', "", 'line 9', {}, {'variable': 'basic'})
test('fetch(basic, 1)', "[{'new_val':null}]", 'line 14', {}, {})
test("tbl.insert({'id':1})", "partial({'errors':0, 'inserted':1})", 'line 19', {}, {})
test('fetch(basic, 1)', "[{'old_val':null, 'new_val':{'id':1}}]", 'line 22', {}, {})
test("tbl.get(1).update({'update':1})", "partial({'errors':0, 'replaced':1})", 'line 27', {}, {})
test('fetch(basic, 1)', "[{'old_val':{'id':1}, 'new_val':{'id':1,'update':1}}]", 'line 30', {}, {})
test('tbl.get(1).delete()', "partial({'errors':0, 'deleted':1})", 'line 35', {}, {})
test('fetch(basic, 1)', "[{'old_val':{'id':1,'update':1}, 'new_val':null}]", 'line 38', {}, {})
test('basic.close()', "", 'line 43', {}, {})
test("tbl.get(1).changes({squash:false,includeInitial:true}).filter(r.row('new_val')('update').gt(2))('new_val')('update')", "", 'line 51', {}, {'variable': 'filter'})
test("tbl.insert({'id':1, 'update':1})", "", 'line 53', {}, {})
test("tbl.get(1).update({'update':4})", "", 'line 54', {}, {})
test("tbl.get(1).update({'update':1})", "", 'line 55', {}, {})
test("tbl.get(1).update({'update':7})", "", 'line 56', {}, {})
test('fetch(filter, 2)', '[4,7]', 'line 58', {}, {})
test("tbl.get(3).changes({squash:false,includeInitial:true}).pluck({'new_val':['red', 'blue']})('new_val')", "", 'line 65', {}, {'variable': 'pluck'})
test("tbl.insert({'id':3, 'red':1, 'green':1})", "partial({'errors':0, 'inserted':1})", 'line 67', {}, {})
test("tbl.get(3).update({'blue':2, 'green':3})", "partial({'errors':0, 'replaced':1})", 'line 69', {}, {})
test("tbl.get(3).update({'green':4})", "partial({'errors':0, 'replaced':1})", 'line 71', {}, {})
test("tbl.get(3).update({'blue':4})", "partial({'errors':0, 'replaced':1})", 'line 73', {}, {})
test('fetch(pluck, 4)', "[{'red': 1}, {'blue': 2, 'red': 1}, {'blue': 2, 'red': 1}, {'blue': 4, 'red': 1}]", 'line 76', {}, {})
define("r.db('rethinkdb').table('_debug_scratch')", 'dtbl')
test('dtbl.get(1).changes({includeInitial:true})', "", 'line 85', {}, {'variable': 'debug'})
test('fetch(debug, 1)', "[{'new_val':null}]", 'line 88', {}, {})
test("dtbl.insert({'id':1})", "partial({'errors':0, 'inserted':1})", 'line 91', {}, {})
test('fetch(debug, 1)', "[{'old_val':null, 'new_val':{'id':1}}]", 'line 93', {}, {})
test("dtbl.get(1).update({'update':1})", "partial({'errors':0, 'replaced':1})", 'line 96', {}, {})
test('fetch(debug, 1)', "[{'old_val':{'id':1}, 'new_val':{'id':1,'update':1}}]", 'line 98', {}, {})
test('dtbl.get(1).delete()', "partial({'errors':0, 'deleted':1})", 'line 101', {}, {})
test('fetch(debug, 1)', "[{'old_val':{'id':1,'update':1}, 'new_val':null}]", 'line 103', {}, {})
test("dtbl.insert({'id':5, 'red':1, 'green':1})", "({'skipped':0, 'deleted':0, 'unchanged':0, 'errors':0, 'replaced':0, 'inserted':1})", 'line 106', {}, {})
test("dtbl.get(5).changes({includeInitial:true}).pluck({'new_val':['red', 'blue']})('new_val')", "", 'line 110', {}, {'variable': 'dtblPluck'})
test('fetch(dtblPluck, 1)', "[{'red':1}]", 'line 113', {}, {})
test("dtbl.get(5).update({'blue':2, 'green':3})", "partial({'errors':0, 'replaced':1})", 'line 116', {}, {})
test('fetch(dtblPluck, 1)', "[{'blue':2, 'red':1}]", 'line 119', {}, {})
test("tbl.info()('id')", "", 'line 133', {}, {'variable': 'tableId'})
test("r.db('rethinkdb').table('table_status').get(tableId).changes({includeInitial:true})", "", 'line 135', {}, {'variable': 'rtblPluck'})
test('fetch(rtblPluck, 1)', "partial([{'new_val':partial({'db':'test'})}])", 'line 137', {}, {})
test('tbl.reconfigure({shards:3, replicas:1})', "", 'line 142', {}, {})
test('fetch(rtblPluck, 1, 2)', "partial([{'old_val':partial({'db':'test'}), 'new_val':partial({'db':'test'})}])", 'line 144', {}, {})


the_end()
