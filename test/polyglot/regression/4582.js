#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_4582_js7_2', 'test')
setup_table_check()

test('tbl.get(0).replace(tbl.get(0))', "err('ReqlQueryLogicError','Could not prove argument deterministic.  Maybe you want to use the non_atomic flag?')", 'line 4', {}, {})
test('tbl.get(0).update(tbl.get(0))', "err('ReqlQueryLogicError','Could not prove argument deterministic.  Maybe you want to use the non_atomic flag?')", 'line 6', {}, {})
test('tbl.replace(r.args([tbl.get(0)]))', "err('ReqlQueryLogicError','Could not prove argument deterministic.  Maybe you want to use the non_atomic flag?')", 'line 8', {}, {})


the_end()
