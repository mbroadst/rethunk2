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

test('r.expr(1).sub(1)', '0', 'line 4', {}, {})
test('r.expr(-1).sub(1)', '-2', 'line 16', {}, {})
test('r.expr(1.75).sub(8.5)', '-6.75', 'line 21', {}, {})
test('r.expr(1).sub(2,3,4,5)', '-13', 'line 26', {}, {})
test("r.expr('a').sub(0.8)", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [0])", 'line 30', {}, {})
test("r.expr(1).sub('a')", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [1])", 'line 33', {}, {})
test("r.expr('b').sub('a')", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [0])", 'line 36', {}, {})


the_end()
