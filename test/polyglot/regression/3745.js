#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_3745_js7_2', 'test')
setup_table_check()

test("tbl.insert([ {'id':0, 'a':5}, {'id':1, 'a':6} ])", "partial({'inserted':2})", 'line 4', {}, {})
test("tbl.reduce(function(x,y){return r.object('a', r.add(x('a'), y('a')));})", "({'a':11})", 'line 10', {}, {})
test('tbl.reduce(function(x,y){return r.expr(0)(0);})', "err('ReqlQueryLogicError','Cannot convert NUMBER to SEQUENCE')", 'line 16', {}, {})


the_end()
