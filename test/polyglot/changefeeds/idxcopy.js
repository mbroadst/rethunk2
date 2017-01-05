#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_changefeeds_idxcopy_js7_2', 'test')
setup_table_check()

test("tbl.indexCreate('a')", "partial({'created':1})", 'line 4', {}, {})
test("tbl.indexWait('a')", "", 'line 6', {}, {})
test("tbl.orderBy({index:'a'}).limit(10).changes({squash:2}).limit(9)", "", 'line 10', {'max_batch_rows': '1'}, {'variable': 'feed'})
test("tbl.insert(r.range(0, 12).map(function(row){ return {'id':row, 'a':5}; }))", "partial({'inserted':12, 'errors':0})", 'line 17', {}, {})
test("tbl.getAll(1, 8, 9, {index:'id'}).delete()", "partial({'deleted':3, 'errors':0})", 'line 22', {}, {})
test('wait(2)', "", 'line 26', {}, {})
test('fetch(feed)', 'bag([\n{"new_val":{"a":5, "id":0}, "old_val":null},\n{"new_val":{"a":5, "id":2}, "old_val":null},\n{"new_val":{"a":5, "id":3}, "old_val":null},\n{"new_val":{"a":5, "id":4}, "old_val":null},\n{"new_val":{"a":5, "id":5}, "old_val":null},\n{"new_val":{"a":5, "id":6}, "old_val":null},\n{"new_val":{"a":5, "id":7}, "old_val":null},\n{"new_val":{"a":5, "id":10}, "old_val":null},\n{"new_val":{"a":5, "id":11}, "old_val":null}])', 'line 28', {}, {})


the_end()
