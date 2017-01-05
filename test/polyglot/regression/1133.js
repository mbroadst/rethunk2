#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table_check()

define('({})', 'a')
define("({'a':a})", 'b')
define('b', "a['b']")
test('r.expr(a)', "err('ReqlDriverCompileError', 'Nesting depth limit exceeded.', [])", 'line 8', {}, {})
test("r.expr({'a':{'a':{'a':{'a':{'a':{'a':{'a':{}}}}}}}}, 7)", "err('ReqlDriverCompileError', 'Nesting depth limit exceeded.', [])", 'line 13', {}, {})
test("r.expr({'a':{'a':{'a':{'a':{'a':{'a':{'a':{}}}}}}}}, 10)", "({'a':{'a':{'a':{'a':{'a':{'a':{'a':{}}}}}}}})", 'line 18', {}, {})


the_end()
