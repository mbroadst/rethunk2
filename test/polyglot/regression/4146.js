#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_4146_js7_2', 'test')
setup_table_check()

test('tbl.indexCreate("multi_idx", function(x) { return [x("a"), x("b")] }, {multi:true})', '({created: 1})', 'line 6', {}, {})
test('tbl.indexWait("multi_idx")', "", 'line 8', {}, {})
test('tbl.insert([{a:"a", b:null}, {a:"a", b:r.point(0,0)}])("inserted")', '2', 'line 10', {}, {})
test('tbl.getAll("a", {index:"multi_idx"}).count()', '2', 'line 13', {}, {})


the_end()
