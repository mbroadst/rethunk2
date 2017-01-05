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

test('r.expr(10).mod(3)', '1', 'line 4', {}, {})
test('r.expr(-10).mod(-3)', '-1', 'line 15', {}, {})
test("r.expr(4).mod('a')", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [1])", 'line 21', {}, {})
test("r.expr('a').mod(1)", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [0])", 'line 26', {}, {})
test("r.expr('a').mod('b')", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [0])", 'line 31', {}, {})


the_end()
