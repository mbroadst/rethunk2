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

test('r(4).add(r(2).mul(r(26).mod(18))).div(5).sub(3)', '1', 'line 5', {}, {})


the_end()
