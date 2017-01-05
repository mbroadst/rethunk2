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

test('r.expr(0).add(1)', '1', 'line 5', {}, {})
test('r.add(0, 1)', '1', 'line 6', {}, {})
test('r.expr(2).sub(1)', '1', 'line 7', {}, {})
test('r.sub(2, 1)', '1', 'line 8', {}, {})
test('r.expr(2).div(2)', '1', 'line 9', {}, {})
test('r.div(2, 2)', '1', 'line 10', {}, {})
test('r.expr(1).mul(1)', '1', 'line 11', {}, {})
test('r.mul(1, 1)', '1', 'line 12', {}, {})
test('r.expr(1).mod(2)', '1', 'line 13', {}, {})
test('r.mod(1, 2)', '1', 'line 14', {}, {})
test('r.expr(true).and(true)', 'true', 'line 18', {}, {})
test('r.expr(true).or(true)', 'true', 'line 19', {}, {})
test('r.and(true, true)', 'true', 'line 20', {}, {})
test('r.or(true, true)', 'true', 'line 21', {}, {})
test('r.expr(false).not()', 'true', 'line 22', {}, {})
test('r.not(false)', 'true', 'line 23', {}, {})
test('r.expr(1).eq(1)', 'true', 'line 34', {}, {})
test('r.expr(1).ne(2)', 'true', 'line 35', {}, {})
test('r.expr(1).lt(2)', 'true', 'line 36', {}, {})
test('r.expr(1).gt(0)', 'true', 'line 37', {}, {})
test('r.expr(1).le(1)', 'true', 'line 38', {}, {})
test('r.expr(1).ge(1)', 'true', 'line 39', {}, {})
test('r.eq(1, 1)', 'true', 'line 40', {}, {})
test('r.ne(1, 2)', 'true', 'line 41', {}, {})
test('r.lt(1, 2)', 'true', 'line 42', {}, {})
test('r.gt(1, 0)', 'true', 'line 43', {}, {})
test('r.le(1, 1)', 'true', 'line 44', {}, {})
test('r.ge(1, 1)', 'true', 'line 45', {}, {})


the_end()
