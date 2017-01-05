#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_453_js7_2', 'test')
setup_table_check()

test("tbl.insert([{'a':1},{'a':2}])", "partial({'inserted':2})", 'line 5', {}, {})
test('tbl.map(function(x) { return tbl; })', 'err("ReqlQueryLogicError", \'Expected type DATUM but found TABLE:\', [0])', 'line 8', {}, {})
test("tbl.map(function(x) { return tbl.coerceTo('array'); }).count()", '2', 'line 13', {}, {})


the_end()
