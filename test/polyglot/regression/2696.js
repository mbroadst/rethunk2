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

test('r.expr([1,2,3,4]).deleteAt(4,4)', '[1,2,3,4]', 'line 3', {}, {})
test('r.expr([]).deleteAt(0,0)', '[]', 'line 5', {}, {})


the_end()
