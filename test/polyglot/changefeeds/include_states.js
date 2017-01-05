#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_changefeeds_include_states_js7_2', 'test')
setup_table_check()

test('tbl.changes({squash:true, includeStates:true}).limit(1)', "[{'state':'ready'}]", 'line 6', {}, {})
test('tbl.get(0).changes({squash:true, includeStates:true, includeInitial:true}).limit(3)', "[{'state':'initializing'}, {'new_val':null}, {'state':'ready'}]", 'line 11', {}, {})
test("tbl.orderBy({index:'id'}).limit(10).changes({squash:true, includeStates:true, includeInitial:true}).limit(2)", "[{'state':'initializing'}, {'state':'ready'}]", 'line 16', {}, {})
test("tbl.insert({'id':1})", "", 'line 19', {}, {})
test("tbl.orderBy({index:'id'}).limit(10).changes({squash:true, includeStates:true, includeInitial:true}).limit(3)", "[{'state':'initializing'}, {'new_val':{'id':1}}, {'state':'ready'}]", 'line 23', {}, {})
test('tbl.changes({squash:true, includeStates:true})', "", 'line 28', {}, {'variable': 'tblchanges'})
test("tbl.insert({'id':2})", "", 'line 30', {}, {})
test('fetch(tblchanges, 2)', "[{'state':'ready'},{'new_val':{'id':2},'old_val':null}]", 'line 32', {}, {})
test('tbl.get(2).changes({includeStates:true, includeInitial:true})', "", 'line 37', {}, {'variable': 'getchanges'})
test("tbl.get(2).update({'a':1})", "", 'line 39', {}, {})
test('fetch(getchanges, 4)', "[{'state':'initializing'}, {'new_val':{'id':2}}, {'state':'ready'}, {'old_val':{'id':2},'new_val':{'id':2,'a':1}}]", 'line 41', {}, {})
test("tbl.orderBy({index:'id'}).limit(10).changes({includeStates:true, includeInitial:true})", "", 'line 46', {}, {'variable': 'limitchanges'})
test("tbl.orderBy({index:r.desc('id')}).limit(10).changes({includeStates:true, includeInitial:true})", "", 'line 50', {}, {'variable': 'limitchangesdesc'})
test("tbl.insert({'id':3})", "", 'line 52', {}, {})
test('fetch(limitchanges, 5)', "[{'state':'initializing'}, {'new_val':{'id':1}}, {'new_val':{'a':1, 'id':2}}, {'state':'ready'}, {'old_val':null, 'new_val':{'id':3}}]", 'line 54', {}, {})
test('fetch(limitchangesdesc, 5)', "[{'state':'initializing'}, {'new_val':{'a':1, 'id':2}}, {'new_val':{'id':1}}, {'state':'ready'}, {'old_val':null, 'new_val':{'id':3}}]", 'line 57', {}, {})


the_end()
