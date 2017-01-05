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

test('r.expr(null).typeOf()', "'NULL'", 'line 5', {}, {})
test('r.typeOf(null)', "'NULL'", 'line 9', {}, {})
test('r(null).typeOf(1)', "err('ReqlCompileError', 'Expected 1 argument but found 2.', [0])", 'line 13', {}, {})


the_end()
