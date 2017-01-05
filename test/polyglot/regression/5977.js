#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_5977_js7_2', 'test')
setup_table_check()

test('r.expr({data: \'flat_value\'}).merge({data: {nested: r.literal("a")}})', '({data: {nested: "a"}})', 'line 4', {}, {})


the_end()
