#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_2774_js7_2', 'test')
setup_table_check()

define("Buffer('')", 'binaryA')
define("Buffer('123456789012345678901234567890123456789012345678901234567890' +\n'123456789012345678901234567890123456789012345678901234567890')", 'binary_trunc1')
define("Buffer('123456789012345678901234567890123456789012345678901234567890' +\n'123456789012345678901234567890123456789012345678901234567891')", 'binary_trunc2')
define("Buffer('5aurhbviunr')", 'binaryB')
define("'123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'", 'str_trunc1')
define("'123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567891'", 'str_trunc2')
define("[  {'id':0,'idx':[0]},\n{'id':1,'idx':[1, 2, 3, 4, 5, 6, 7, 0]},\n{'id':2,'idx':[1, 2, 3, 4, 5, 6, 7, 4]},\n{'id':3,'idx':[1, 2, 3, 4, 5, 6, 7, 4, 5]},\n{'id':4,'idx':[1, 2, 3, 4, 5, 6, 7, 8, 1]},\n{'id':5,'idx':[1, 3, binary_trunc1]},\n{'id':6,'idx':[1, 3, binary_trunc2]},\n{'id':7,'idx':[1, 3, r.epochTime(0), r.epochTime(0), r.epochTime(0)]},\n{'id':8,'idx':[1, 3, r.epochTime(0), r.epochTime(0), r.epochTime(0), r.epochTime(0)]},\n{'id':9,'idx':[1, 3, r.epochTime(0), r.epochTime(0), r.epochTime(0), r.epochTime(1)]},\n{'id':10,'idx':[1, 3, str_trunc1, str_trunc1]},\n{'id':11,'idx':[1, 3, str_trunc1, str_trunc2]},\n{'id':12,'idx':[1, 4, 3, 4, 5, 6, 7, 8, 2]},\n{'id':13,'idx':[binary_trunc1]},\n{'id':14,'idx':[binary_trunc2]},\n{'id':15,'idx':false},\n{'id':16,'idx':true},\n{'id':17,'idx':-500},\n{'id':18,'idx':500},\n{'id':19,'idx':binaryA},\n{'id':20,'idx':binary_trunc1},\n{'id':21,'idx':binary_trunc2},\n{'id':22,'idx':binaryB},\n{'id':23,'idx':r.epochTime(0)},\n{'id':24,'idx':''},\n{'id':25,'idx':' str'},\n{'id':26,'idx':str_trunc1},\n{'id':27,'idx':str_trunc2}]", 'trows')
define("r.range(tbl.count()).coerceTo('array')", 'expected')
test("tbl.insert(trows)('inserted')", '28', 'line 70', {}, {})
test("tbl.indexCreate('idx')", "({'created':1})", 'line 73', {}, {})
test("tbl.indexWait('idx').pluck('index', 'ready')", "[{'index':'idx','ready':true}]", 'line 76', {}, {})
test("tbl.orderBy({index:'idx'}).map(r.row('id')).coerceTo('array').eq(expected)", 'true', 'line 80', {}, {})
test("tbl.orderBy({index:'idx'}).between(r.minval, r.maxval).map(r.row('id')).coerceTo('array').eq(expected)", 'true', 'line 86', {}, {})
test("tbl.orderBy({index:'idx'}).between([1,2,3,4,5,6,7,4],[1,2,3,4,5,6,8]).map(r.row('id')).coerceTo('array')", '[2,3,4]', 'line 91', {}, {})
test("tbl.orderBy({index:'idx'}).between([1,2,3,4,5,6,7,4,r.minval],[1,2,3,4,5,6,7,4,r.maxval]).map(r.row('id')).coerceTo('array')", '[3]', 'line 96', {}, {})


the_end()
