#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_545_js7_2', 'test')
setup_table_check()

test("tbl.insert([{'id':0}, {'id':1}, {'id':2}])", "", 'line 5', {}, {})
test('tbl.reduce(r.js("(function(x,y){return 1;})"))', '1', 'line 7', {}, {})
test('tbl.reduce(r.js("(function(x,y){return {id:x[\\"id\\"] + y[\\"id\\"]};})"))', "({'id':3})", 'line 12', {}, {})


the_end()
