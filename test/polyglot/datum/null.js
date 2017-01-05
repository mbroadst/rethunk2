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

test('r(null)', '(null)', 'line 4', {}, {})
test('r.expr(null)', '(null)', 'line 5', {}, {})
test('r.expr(null).typeOf()', "'NULL'", 'line 9', {}, {})
test("r.expr(null).coerceTo('string')", "'null'", 'line 14', {}, {})
test("r.expr(null).coerceTo('null')", 'null', 'line 17', {}, {})


the_end()
