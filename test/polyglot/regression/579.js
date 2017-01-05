#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_579_js7_2', 'test')
setup_table_check()

test("tbl.insert({'name':'Jim Brown'})", "", 'line 5', {}, {})
test('tbl.indexCreate("579", function(rec){return r.js("1")})', 'err("ReqlQueryLogicError", "Could not prove function deterministic.  Index functions must be deterministic.", [])', 'line 7', {}, {})
test('tbl.indexCreate("579", function(rec){return tbl.get(0)})', 'err("ReqlQueryLogicError", "Could not prove function deterministic.  Index functions must be deterministic.", [])', 'line 12', {}, {})


the_end()
