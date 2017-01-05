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

define('r.expr([1,2,3,4,5])', 'arr')
test('arr.skip(2)', '[3,4,5]', 'line 7', {}, {})
test("arr.skip('a')", 'err("ReqlQueryLogicError", "Expected type NUMBER but found STRING.", [1])', 'line 10', {}, {})
test('arr.skip([1,2,3])', 'err("ReqlQueryLogicError", "Expected type NUMBER but found ARRAY.", [1])', 'line 13', {}, {})
test('arr.skip({}).count()', 'err("ReqlQueryLogicError", "Expected type NUMBER but found OBJECT.", [0, 1])', 'line 16', {}, {})
test('arr.skip(null)', 'err("ReqlNonExistenceError", "Expected type NUMBER but found NULL.", [1])', 'line 19', {}, {})


the_end()
