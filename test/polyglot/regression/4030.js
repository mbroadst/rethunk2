#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_4030_js7_2', 'test')
setup_table_check()

define("[{'id':1}, {'id':2}, {'id':3}, {'id':4}, {'id':5}, {'id':6}]", 'data')
define("[{'id':7}, {'id':8}, {'id':9}, {'id':10}]", 'changes')
test('tbl.insert(data)', "partial({'errors':0, 'inserted':6})", 'line 12', {}, {})
test('tbl.count()', '(6)', 'line 15', {}, {})
test('tbl.union(tbl)', 'bag(data.concat(data))', 'line 21', {}, {})
test('r.union(tbl, tbl)', 'bag(data.concat(data))', 'line 27', {}, {})


the_end()
