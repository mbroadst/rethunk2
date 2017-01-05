#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_3637_js7_2', 'test')
setup_table_check()

test("tbl.insert([{'id':0.0, 'value':'abc'}, {'id':[1, r.json('-0.0')], 'value':'def'}])", "partial({'inserted':2})", 'line 6', {}, {})
test('tbl.get(0.0)', "({'id':0.0, 'value':'abc'})", 'line 10', {}, {})
test("tbl.get(r.json('-0.0'))", "({'id':0.0, 'value':'abc'})", 'line 14', {}, {})
test('tbl.get([1, 0.0])', "({'id':[1, -0.0], 'value':'def'})", 'line 17', {}, {})
test("tbl.get([1, r.json('-0.0')])", "({'id':[1, -0.0], 'value':'def'})", 'line 21', {}, {})
test("tbl.get(0.0).pluck('id').toJsonString()", '\'{"id":0}\'', 'line 25', {}, {})
test("tbl.get(r.json('-0.0')).pluck('id').toJsonString()", '\'{"id":0}\'', 'line 29', {}, {})
test("tbl.get([1, 0.0]).pluck('id').toJsonString()", '\'{"id":[1,-0.0]}\'', 'line 32', {}, {})
test("tbl.get([1, r.json('-0.0')]).pluck('id').toJsonString()", '\'{"id":[1,-0.0]}\'', 'line 36', {}, {})
test("tbl.insert({'id':0.0})", "partial({'errors':1})", 'line 41', {}, {})
test("tbl.insert({'id':[1,0.0]})", "partial({'errors':1})", 'line 42', {}, {})
test("tbl.insert({'id':r.json('-0.0')})", "partial({'errors':1})", 'line 49', {}, {})
test("tbl.insert({'id':[1,r.json('-0.0')]})", "partial({'errors':1})", 'line 50', {}, {})


the_end()
