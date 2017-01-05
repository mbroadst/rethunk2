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

test('r.add(1, 1)', '2', 'line 3', {}, {})
test('r(1).add(1)', '2', 'line 6', {}, {})
test('r(-1).add(1)', '0', 'line 17', {}, {})
test('r(1.75).add(8.5)', '10.25', 'line 22', {}, {})
test("r('').add('')", "''", 'line 28', {}, {})
test("r('abc').add('def')", "'abcdef'", 'line 33', {}, {})
test('r([1,2]).add([3]).add([4,5]).add([6,7,8])', '[1,2,3,4,5,6,7,8]', 'line 39', {}, {})
test('r(1).add(2,3,4,5)', '15', 'line 44', {}, {})
test("r('a').add('b', 'c', 'd')", "'abcd'", 'line 47', {}, {})
test("r(1).add('a')", 'err("ReqlQueryLogicError", "Expected type NUMBER but found STRING.", [1])', 'line 51', {}, {})
test("r('a').add(1)", 'err("ReqlQueryLogicError", "Expected type STRING but found NUMBER.", [1])', 'line 56', {}, {})
test('r([]).add(1)', 'err("ReqlQueryLogicError", "Expected type ARRAY but found NUMBER.", [1])', 'line 61', {}, {})


the_end()
