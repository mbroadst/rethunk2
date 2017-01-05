#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_4132_js7_2', 'test')
setup_table_check()

test('r.and()', 'true', 'line 4', {}, {})
test('r.or()', 'false', 'line 7', {}, {})
test('r.expr(false).or(null)', 'null', 'line 10', {}, {})


the_end()
