#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('t', 'polyglot_regression_309_js7_2', 'test')
setup_table_check()

test("t.insert([{'id':0}, {'id':1}])", "", 'line 7', {}, {})
test('t.union([2,3,4])', "bag([{'id':0}, {'id':1}, 2, 3, 4])", 'line 10', {}, {})
test('r.expr([2,3,4]).union(t)', "bag([{'id':0}, {'id':1}, 2, 3, 4])", 'line 13', {}, {})


the_end()
