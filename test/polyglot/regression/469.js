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

test("r.dbCreate('d469')", "partial({'dbs_created':1})", 'line 4', {}, {})
test("r.db('d469').tableCreate('t469')", "partial({'tables_created':1})", 'line 6', {}, {})
test("r.db('d469').table('t469').indexCreate('x')", "({'created':1})", 'line 8', {}, {})
test("r.db('d469').table('t469').indexWait('x').pluck('index', 'ready')", "[{'ready':true, 'index':'x'}]", 'line 10', {}, {})
test('r.minval.info()', "({'type':'MINVAL'})", 'line 13', {}, {})
test('r.maxval.info()', "({'type':'MAXVAL'})", 'line 15', {}, {})
test('r(null).info()', "({'type':'NULL'})", 'line 17', {}, {})
test('r(true).info()', "({'type':'BOOL','value':'true'})", 'line 22', {}, {})
test('r(1).info()', "({'type':'NUMBER','value':'1'})", 'line 26', {}, {})
test("r('1').info()", '({\'type\':\'STRING\',\'value\':(\'"1"\')})', 'line 30', {}, {})
test('r([1]).info()', '({\'type\':\'ARRAY\',\'value\':"[\\n\\t1\\n]"})', 'line 34', {}, {})
test('r({a:1}).info()', '({\'type\':\'OBJECT\',\'value\':"{\\n\\t\\"a\\":\\t1\\n}"})', 'line 38', {}, {})
test("r.db('d469').info()", "partial({'type':'DB','name':'d469'})", 'line 42', {}, {})
test("r.db('d469').table('t469').info()", "({'type':'TABLE','name':'t469','id':uuid(),\n'db':{'type':'DB','name':'d469','id':uuid()},\n'primary_key':'id', 'indexes':['x'], 'doc_count_estimates':[0]})", 'line 44', {}, {})
test("r.db('d469').table('t469').filter(function(x) { return true; }).info()", "({'type':'SELECTION<STREAM>',\n'table':{'type':'TABLE','name':'t469','id':uuid(),\n'db':{'type':'DB','name':'d469','id':uuid()},\n'primary_key':'id', 'indexes':['x'], 'doc_count_estimates':[0]}})", 'line 50', {}, {})
test("r.db('d469').table('t469').map(function(x) { return 1; }).info()", "({'type':'STREAM'})", 'line 57', {}, {})
test("r.db('d469').table('t469').between(0, 1).info()", "({'index':'id',\n'left_bound':0,\n'left_bound_type':'closed',\n'right_bound':1,\n'right_bound_type':'open',\n'sorting':'UNORDERED',\n'table':{'db':{'id':uuid(), 'name':'d469', 'type':'DB'},\n'doc_count_estimates':[0],\n'id':uuid(),\n'indexes':['x'],\n'name':'t469',\n'primary_key':'id',\n'type':'TABLE'},\n'type':'TABLE_SLICE'})", 'line 60', {}, {})
test("r.db('d469').table('t469').between(0, 1, {index:'a'}).info()", "({'index':'a',\n'left_bound':0,\n'left_bound_type':'closed',\n'right_bound':1,\n'right_bound_type':'open',\n'sorting':'UNORDERED',\n'table':{'db':{'id':uuid(), 'name':'d469', 'type':'DB'},\n'doc_count_estimates':[0],\n'id':uuid(),\n'indexes':['x'],\n'name':'t469',\n'primary_key':'id',\n'type':'TABLE'},\n'type':'TABLE_SLICE'})", 'line 76', {}, {})
test("r.db('d469').table('t469').orderBy({index:'a'}).between(0, 1, {index:'a'}).info()", "({'index':'a',\n'left_bound':0,\n'left_bound_type':'closed',\n'right_bound':1,\n'right_bound_type':'open',\n'sorting':'ASCENDING',\n'table':{'db':{'id':uuid(), 'name':'d469', 'type':'DB'},\n'doc_count_estimates':[0],\n'id':uuid(),\n'indexes':['x'],\n'name':'t469',\n'primary_key':'id',\n'type':'TABLE'},\n'type':'TABLE_SLICE'})", 'line 93', {}, {})
test("r.db('d469').table('t469').between(r.minval, r.maxval).info()", "({'index':'id',\n'left_bound_type':'unbounded',\n'right_bound_type':'unbounded',\n'sorting':'UNORDERED',\n'table':{'db':{'id':uuid(), 'name':'d469', 'type':'DB'},\n'doc_count_estimates':[0],\n'id':uuid(),\n'indexes':['x'],\n'name':'t469',\n'primary_key':'id',\n'type':'TABLE'},\n'type':'TABLE_SLICE'})", 'line 110', {}, {})
test("r.db('d469').table('t469').between(r.maxval, r.minval).info()", "({'index':'id',\n'left_bound_type':'unachievable',\n'right_bound_type':'unachievable',\n'sorting':'UNORDERED',\n'table':{'db':{'id':uuid(), 'name':'d469', 'type':'DB'},\n'doc_count_estimates':[0],\n'id':uuid(),\n'indexes':['x'],\n'name':'t469',\n'primary_key':'id',\n'type':'TABLE'},\n'type':'TABLE_SLICE'})", 'line 124', {}, {})
test("r.dbDrop('d469')", "partial({'dbs_dropped':1})", 'line 138', {}, {})


the_end()
