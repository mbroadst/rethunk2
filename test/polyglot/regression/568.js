#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_568_js7_2', 'test')
setup_table_check()

test("tbl.insert({'name':'Jim Brown'})", "", 'line 5', {}, {})
test('tbl.concatMap(function(rec){return rec("name")})', 'err("ReqlQueryLogicError", "Cannot convert STRING to SEQUENCE", [])', 'line 7', {}, {})


the_end()
