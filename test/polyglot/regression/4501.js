#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_4501_js7_2', 'test')
setup_table_check()

test('tbl.indexWait("missing")', "err_regex('ReqlOpFailedError', 'Index `missing` was not found on table `[a-zA-Z0-9_]+.[a-zA-Z0-9_]+`[.]', [0])", 'line 4', {}, {})


the_end()
