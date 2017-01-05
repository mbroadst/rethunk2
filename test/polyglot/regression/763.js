#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_763_js7_2', 'test')
setup_table_check()

test('tbl.indexCreate()', 'err("ReqlCompileError", "Expected between 1 and 3 arguments but found 0.")', 'line 4', {}, {})
test("tbl.indexCreate('a', 'b', 'c', 'd')", 'err("ReqlCompileError", "Expected between 1 and 3 arguments but found 4.")', 'line 7', {}, {})
test("tbl.indexCreate('a', 'b')", 'err("ReqlQueryLogicError", "Expected type FUNCTION but found DATUM:")', 'line 10', {}, {})
test("tbl.indexCreate('a')", "({'created':1})", 'line 13', {}, {})
test("r('a').eq()", 'err("ReqlCompileError", "Expected 2 or more arguments but found 1.")', 'line 17', {}, {})
test("r('a').lt()", 'err("ReqlCompileError", "Expected 2 or more arguments but found 1.")', 'line 20', {}, {})
test("r(['a']).union()", "['a']", 'line 23', {}, {})
test('r.do()', 'err("ReqlCompileError", "Expected 1 or more arguments but found 0.")', 'line 26', {}, {})
test('r.add()', 'err("ReqlCompileError", "Expected 1 or more arguments but found 0.")', 'line 29', {}, {})
test('r.add(1)', '1', 'line 32', {}, {})


the_end()
