#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_5130_js7_2', 'test')
setup_table_check()

test('tbl.indexCreate("a", function (o) { return r.point(tbl.get(0)(\'x\'), 1); })', 'err("ReqlQueryLogicError", "Could not prove function deterministic.  Index functions must be deterministic.")', 'line 4', {}, {})


the_end()
