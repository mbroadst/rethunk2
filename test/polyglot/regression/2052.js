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

test('r.expr(1)', '1', 'line 3', {'array_limit': '16'}, {})
test('r.expr(1)', 'err("ReqlCompileError", "Unrecognized global optional argument `obviously_bogus`.", [])', 'line 7', {'obviously_bogus': '16'}, {})


the_end()
