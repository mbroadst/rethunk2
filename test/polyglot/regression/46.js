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

test("r.tableCreate('46')", "partial({'tables_created':1})", 'line 4', {}, {})
test('r.tableList()', "['46']", 'line 7', {}, {})
test("r.tableDrop('46')", "partial({'tables_dropped':1})", 'line 10', {}, {})


the_end()
