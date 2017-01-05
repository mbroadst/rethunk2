#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_1023_js7_2', 'test')
setup_table_check()

define("Buffer('')", 'binaryA')
define("Buffer('5aurhbviunr')", 'binaryB')
define("[{'num':0,'id':[0]},\n{'num':1,'id':[1, 2, 3, 4, 0]},\n{'num':2,'id':[1, 2, 3, 4, 4]},\n{'num':3,'id':[1, 2, 3, 4, 4, 5]},\n{'num':4,'id':[1, 2, 3, 4, 8, 1]},\n{'num':5,'id':[1, 3, r.epochTime(0)]},\n{'num':6,'id':[1, 3, r.epochTime(0), r.epochTime(0)]},\n{'num':7,'id':[1, 3, r.epochTime(0), r.epochTime(1)]},\n{'num':8,'id':[1, 4, 3, 4, 8, 2]},\n{'num':9,'id':false},\n{'num':10,'id':true},\n{'num':11,'id':-500},\n{'num':12,'id':500},\n{'num':13,'id':binaryA},\n{'num':14,'id':binaryB},\n{'num':15,'id':r.epochTime(0)},\n{'num':16,'id':''},\n{'num':17,'id':' str'}]", 'trows')
define("r.range(tbl.count()).coerceTo('array')", 'expected')
test("tbl.insert(trows)('inserted')", '18', 'line 42', {}, {})
test("tbl.orderBy({index:'id'}).map(r.row('num')).coerceTo('array').eq(expected)", 'true', 'line 46', {}, {})
test("tbl.orderBy({index:'id'}).between(r.minval, r.maxval).map(r.row('num')).coerceTo('array').eq(expected)", 'true', 'line 52', {}, {})
test("tbl.orderBy({index:'id'}).between([1,2,3,4,4],[1,2,3,5]).map(r.row('num')).coerceTo('array')", '[2,3,4]', 'line 57', {}, {})
test("tbl.orderBy({index:'id'}).between([1,2,3,4,4,r.minval],[1,2,3,4,4,r.maxval]).map(r.row('num')).coerceTo('array')", '[3]', 'line 62', {}, {})


the_end()
