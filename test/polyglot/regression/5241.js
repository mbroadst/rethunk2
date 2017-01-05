#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_5241_js7_2', 'test')
setup_table_check()

define("r.db('rethinkdb').table('_debug_scratch')", 'dtbl')


the_end()
