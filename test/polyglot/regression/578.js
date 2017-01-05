#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_578_js7_2', 'test')
setup_table_check()

test('tbl.indexCreate("578", function(rec){return 1})', "({'created':1})", 'line 5', {}, {})
test('tbl.indexWait("578").pluck(\'index\', \'ready\')', "[{'ready':true, 'index':'578'}]", 'line 9', {}, {})
test('tbl.indexCreate("578", function(rec){return 1})', 'err_regex("ReqlOpFailedError", "Index `578` already exists on table `[a-zA-Z0-9_]+.[a-zA-Z0-9_]+`[.]", [])', 'line 12', {}, {})
test('tbl.indexDrop("578")', "({'dropped':1})", 'line 17', {}, {})
test('tbl.indexDrop("578")', 'err_regex("ReqlOpFailedError", "Index `578` does not exist on table `[a-zA-Z0-9_]+.[a-zA-Z0-9_]+`[.]", [])', 'line 22', {}, {})


the_end()
