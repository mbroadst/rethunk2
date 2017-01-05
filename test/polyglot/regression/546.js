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

test('r(1).do(function(a) { return a; })', '1', 'line 5', {}, {})
test('r(1).do(function(a) {\nreturn r(2).do(function(b) {\nreturn b;\n});\n})', '2', 'line 11', {}, {})
test('r(1).do(function(a) {\nreturn r(2).do(function(b) {\nreturn a;\n});\n})', '1', 'line 21', {}, {})


the_end()
