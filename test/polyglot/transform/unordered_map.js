#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('even', 'polyglot_transform_unordered_map_js7_2', 'test')
setup_table('odd', 'polyglot_transform_unordered_map_js7_2_tbl1', 'test')
setup_table('odd2', 'polyglot_transform_unordered_map_js7_2_tbl2', 'test')
setup_table_check()

test('odd.insert([{"id":1, "num":1}, {"id":3, "num":3}, {"id":5, "num":5}])', "", 'line 6', {}, {})
test('even.insert([{"id":2, "num":2}, {"id":4, "num":4}, {"id":6, "num":6}])', "", 'line 7', {}, {})
test('odd2.insert([{"id":7, "num":1}, {"id":8, "num":3}, {"id":9, "num":2}])', "", 'line 8', {}, {})
test('odd.orderBy("num").union(even.orderBy("num"), {"interleave" : false})', '[{"id":1, "num":1}, {"id":3, "num":3}, {"id":5, "num":5}, {"id":2, "num":2}, {"id":4, "num":4}, {"id":6, "num":6}]', 'line 12', {}, {})
test('even.orderBy("num").union(odd.orderBy("num"), {"interleave" : false})', '[{"id":2, "num":2}, {"id":4, "num":4}, {"id":6, "num":6}, {"id":1, "num":1}, {"id":3, "num":3}, {"id":5, "num":5}]', 'line 17', {}, {})
test('odd.orderBy("num").union(even.orderBy("num"), {"interleave": "num"})', '[{"id":1, "num":1}, {"id":2, "num":2}, {"id":3, "num":3}, {"id":4, "num":4}, {"id":5, "num":5}, {"id":6, "num":6}]', 'line 23', {}, {})
test('odd.orderBy("num").union(even.orderBy("num"), {"interleave": r.desc("num")})', 'err("ReqlQueryLogicError","The streams given as arguments are not ordered by given ordering.")', 'line 29', {}, {})
test('odd.orderBy("num").union(even.orderBy("num"), {"interleave": function(x) {return x("num");}})', '[{"id":1, "num":1}, {"id":2, "num":2}, {"id":3, "num":3}, {"id":4, "num":4}, {"id":5, "num":5}, {"id":6, "num":6}]', 'line 35', {}, {})
test('odd2.orderBy("num", r.desc("id")).union(even.orderBy("num", r.desc("id")), {"interleave": [function(x) {return x("num");}, function(x) {return x("id");} ]})', '[{"id": 7, "num": 1}, {"id": 2, "num": 2}, {"id": 9, "num": 2}, {"id": 8, "num": 3}, {"id": 4, "num": 4}, {"id": 6, "num": 6}]', 'line 41', {}, {})

the_end()
