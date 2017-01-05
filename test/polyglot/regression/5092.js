#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_5092_js7_2', 'test')
setup_table_check()

test('tbl.get(0).update({a:r.uuid()})', "err('ReqlQueryLogicError','Could not prove argument deterministic.  Maybe you want to use the non_atomic flag?')", 'line 4', {}, {})
test('tbl.get(0).update({a:r.uuid(r.args([]))})', "err('ReqlQueryLogicError','Could not prove argument deterministic.  Maybe you want to use the non_atomic flag?')", 'line 6', {}, {})
test('tbl.get(0).update({a:r.uuid(r.args(["test"]))})', "err('ReqlQueryLogicError','Could not prove argument deterministic.  Maybe you want to use the non_atomic flag?')", 'line 9', {}, {})
test('tbl.get(0).update({a:r.uuid("test")})', 'partial({skipped:1})', 'line 11', {}, {})
test('tbl.get(0).update({a:r.uuid(r.uuid())})', "err('ReqlQueryLogicError','Could not prove argument deterministic.  Maybe you want to use the non_atomic flag?')", 'line 13', {}, {})


the_end()
