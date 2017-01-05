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

test('r({a:NaN})', 'builtin_err("TypeError", "Illegal non-finite number `NaN`.")', 'line 3', {}, {})
test('r({a:Infinity})', 'builtin_err("TypeError", "Illegal non-finite number `Infinity`.")', 'line 5', {}, {})


the_end()
