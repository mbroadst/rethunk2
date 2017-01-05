#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_sindex_nullsinstrings_js7_2', 'test')
setup_table_check()

test('tbl.indexCreate("key")', '({"created":1})', 'line 4', {}, {})
test('tbl.indexWait().pluck("ready")', '([{"ready":true}])', 'line 6', {}, {})
test('tbl.insert([{"id":1,"key":["a","b"]},{"id":2,"key":["a\\u0000Sb"]}]).pluck("inserted")', '({"inserted":2})', 'line 10', {}, {})
test('tbl.getAll(["a\\u0000Sb"], {"index":"key"}).pluck("id")', '([{"id":2}])', 'line 15', {}, {})
test('tbl.getAll(["a","b"], {"index":"key"}).pluck("id")', '([{"id":1}])', 'line 20', {}, {})


the_end()
