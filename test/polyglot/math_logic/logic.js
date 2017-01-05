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

test('r.and(true,true)', 'true', 'line 18', {}, {})
test('r(true).and(true)', 'true', 'line 19', {}, {})
test('r.and(true,false)', 'false', 'line 40', {}, {})
test('r.and(false,false)', 'false', 'line 41', {}, {})
test('r(true).and(false)', 'false', 'line 42', {}, {})
test('r(false).and(false)', 'false', 'line 43', {}, {})
test('r.or(true,true)', 'true', 'line 66', {}, {})
test('r.or(true,false)', 'true', 'line 67', {}, {})
test('r(true).or(true)', 'true', 'line 68', {}, {})
test('r(true).or(false)', 'true', 'line 69', {}, {})
test('r.and(false,false)', 'false', 'line 82', {}, {})
test('r(false).and(false)', 'false', 'line 83', {}, {})
test('r(true).not()', 'false', 'line 90', {}, {})
test('r(false).not()', 'true', 'line 95', {}, {})
test('r(true).not()', 'false', 'line 98', {}, {})
test('r(false).not()', 'true', 'line 101', {}, {})
test('r(true).and(true).not().eq(r(true).not().or(r(true).not()))', 'true', 'line 112', {}, {})
test('r(true).and(false).not().eq(r(true).not().or(r(false).not()))', 'true', 'line 113', {}, {})
test('r(false).and(false).not().eq(r(false).not().or(r(false).not()))', 'true', 'line 114', {}, {})
test('r(false).and(true).not().eq(r(false).not().or(r(true).not()))', 'true', 'line 115', {}, {})
test('r(true).and(true, true, true, true)', 'true', 'line 119', {}, {})
test('r(true).and(true, true, false, true)', 'false', 'line 122', {}, {})
test('r(true).and(false, true, false, true)', 'false', 'line 125', {}, {})
test('r(false).or(false, false, false, false)', 'false', 'line 128', {}, {})
test('r(false).or(false, false, true, false)', 'true', 'line 131', {}, {})
test('r(false).or(true, false, true, false)', 'true', 'line 134', {}, {})
test("r.expr(r.expr('a')('b')).default(2)", 'err("ReqlQueryLogicError", "Cannot perform bracket on a non-object non-sequence `\\"a\\"`.", [])', 'line 139', {}, {})
test('r.expr(r.and(true, false) >= r.or(false, true))', 'false', 'line 150', {}, {})
test('r(1).and(true)', 'true', 'line 156', {}, {})
test("r(false).or('str')", '("str")', 'line 160', {}, {})
test('r(1).not()', 'false', 'line 164', {}, {})
test('r(null).not()', 'true', 'line 168', {}, {})


the_end()
