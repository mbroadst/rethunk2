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

test('r.expr(true)', 'true', 'line 5', {}, {})
test('r(true)', 'true', 'line 6', {}, {})
test('r.expr(false)', 'false', 'line 12', {}, {})
test('r(false)', 'false', 'line 13', {}, {})
test('r.expr(false).typeOf()', "'BOOL'", 'line 17', {}, {})
test("r.expr(true).coerceTo('string')", "'true'", 'line 21', {}, {})
test("r.expr(true).coerceTo('bool')", 'true', 'line 24', {}, {})
test("r.expr(false).coerceTo('bool')", 'false', 'line 27', {}, {})
test("r.expr(null).coerceTo('bool')", 'false', 'line 30', {}, {})
test("r.expr(0).coerceTo('bool')", 'true', 'line 33', {}, {})
test("r.expr('false').coerceTo('bool')", 'true', 'line 36', {}, {})
test("r.expr('foo').coerceTo('bool')", 'true', 'line 39', {}, {})
test("r.expr([]).coerceTo('bool')", 'true', 'line 42', {}, {})
test("r.expr({}).coerceTo('bool')", 'true', 'line 45', {}, {})


the_end()
