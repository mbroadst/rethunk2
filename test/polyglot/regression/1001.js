#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_1001_js7_2', 'test')
setup_table_check()

test("tbl.insert({'a':null})", "", 'line 4', {}, {})
test("tbl.indexCreate('a')", "", 'line 6', {}, {})
test("tbl.indexCreate('b')", "", 'line 7', {}, {})
test("tbl.indexWait().pluck('index', 'ready')", "", 'line 8', {}, {})
test('tbl.between(r.minval, r.maxval).count()', '1', 'line 10', {}, {})
test("tbl.between(r.minval, r.maxval, {index:'a'}).count()", '0', 'line 13', {}, {})
test("tbl.between(r.minval, r.maxval, {index:'b'}).count()", '0', 'line 17', {}, {})


the_end()
