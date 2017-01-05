#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('./common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_limits_js7_2', 'test')
setup_table_check()

test('r.expr([1,1,1,1]).union([1, 1, 1, 1])', '[1,1,1,1,1,1,1,1]', 'line 6', {'array_limit': '8'}, {})
test('r.expr([1,2,3,4]).union([5, 6, 7, 8])', 'err("ReqlResourceLimitError", "Array over size limit `4`.", [0])', 'line 10', {'array_limit': '4'}, {})
test('r.expr([1,2,3,4,5,6,7,8])', 'err("ReqlResourceLimitError", "Array over size limit `4`.", [0])', 'line 16', {'array_limit': '4'}, {})
test('r.expr([1,2,3,4,5,6,7,8])', 'err("ReqlQueryLogicError", "Illegal array size limit `-1`.  (Must be >= 1.)", [])', 'line 22', {'array_limit': '-1'}, {})
test('r.expr([1,2,3,4,5,6,7,8])', 'err("ReqlQueryLogicError", "Illegal array size limit `0`.  (Must be >= 1.)", [])', 'line 27', {'array_limit': '0'}, {})
define('r.expr([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])', 'tenL')
define('function(l) { return tenL }', 'tenF')
define('r.expr(tenL).concatMap(tenF).concatMap(tenF).concatMap(tenF).concatMap(tenF)', 'hugeL')
test('hugeL.append(1).count()', '100001', 'line 41', {'array_limit': '100001'}, {})
test("tbl.insert({'id':0, 'array':hugeL.append(1)})", 'partial({\'errors\':1, \'first_error\':"Array too large for disk writes (limit 100,000 elements)."})', 'line 47', {'array_limit': '100001'}, {})
test('tbl.get(0)', '(null)', 'line 52', {'array_limit': '100001'}, {})
test("tbl.insert({'id':1, 'array':tenL})", "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':1})", 'line 58', {}, {})
test('tbl.get(1)', "({'array':[1,2,3,4,5,6,7,8,9,10],'id':1})", 'line 60', {'array_limit': '4'}, {})
test("tbl.delete().getField('deleted')", '1', 'line 67', {}, {})
test('tbl.changes({squash:1000000, changefeedQueueSize:10})', "", 'line 70', {}, {'variable': 'c'})
test("tbl.insert([{'id':0}, {'id':1}, {'id':2}, {'id':3}, {'id':4}, {'id':5}, {'id':6}]).getField('inserted')", '7', 'line 73', {}, {})
test("tbl.insert([{'id':7}, {'id':8}, {'id':9}, {'id':10}, {'id':11}, {'id':12}, {'id':13}]).getField('inserted')", '7', 'line 85', {}, {})
test("tbl.delete().getField('deleted')", '14', 'line 97', {}, {})
test('tbl.changes({squash:1000000})', "", 'line 100', {'changefeed_queue_size': '10'}, {'variable': 'c2'})
test("tbl.insert([{'id':0}, {'id':1}, {'id':2}, {'id':3}, {'id':4}, {'id':5}, {'id':6}]).getField('inserted')", '7', 'line 106', {}, {})
test("tbl.insert([{'id':7}, {'id':8}, {'id':9}, {'id':10}, {'id':11}, {'id':12}, {'id':13}]).getField('inserted')", '7', 'line 118', {}, {})

the_end()
