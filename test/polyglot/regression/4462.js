#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_4462_js7_2', 'test')
setup_table_check()

test("tbl.insert({id:1,arr:[]})('inserted')", '1', 'line 5', {}, {})
test("r.range(1000).forEach(function(i) { return tbl.get(1).update(function(x) { return {arr:[x('arr')]} }, {durability:'soft'})})('replaced')", '1000', 'line 7', {}, {})
test('tbl.get(1)', 'partial({})', 'line 11', {}, {})
test("tbl.get(1).delete()('deleted')", '1', 'line 13', {}, {})
test("tbl.insert({id:1,obj:{}})('inserted')", '1', 'line 17', {}, {})
test("r.range(1000).forEach(function(i) { return tbl.get(1).update(function(x) { return {obj:{a:x('obj')}} }, {durability:'soft'})})('replaced')", '1000', 'line 19', {}, {})
test('tbl.get(1)', 'partial({})', 'line 21', {}, {})
test("tbl.get(1).delete()('deleted')", '1', 'line 23', {}, {})


the_end()
