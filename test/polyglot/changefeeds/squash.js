#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_changefeeds_squash_js7_2', 'test')
setup_table_check()

test('tbl.changes({squash:true}).typeOf()', '("STREAM")', 'line 9', {}, {})
test('tbl.changes().limit(2)', "", 'line 14', {}, {'variable': 'normalChanges'})
test('tbl.changes({squash:false}).limit(2)', "", 'line 17', {}, {'variable': 'falseSquashChanges'})
test('tbl.changes({squash:0.5}).limit(1)', "", 'line 21', {}, {'variable': 'longSquashChanges'})
test('tbl.changes({squash:true}).limit(1)', "", 'line 25', {}, {'variable': 'squashChanges'})
test("tbl.insert({'id':100})('inserted')", '1', 'line 29', {}, {})
test("tbl.get(100).update({'a':1})('replaced')", '1', 'line 33', {}, {})
test('normalChanges', "([{'new_val':{'id':100}, 'old_val':null},\n{'new_val':{'a':1, 'id':100}, 'old_val':{'id':100}}])", 'line 36', {}, {})
test('falseSquashChanges', "([{'new_val':{'id':100}, 'old_val':null},\n{'new_val':{'a':1, 'id':100}, 'old_val':{'id':100}}])", 'line 40', {}, {})
test('longSquashChanges', "([{'new_val':{'a':1, 'id':100}, 'old_val':null}])", 'line 44', {}, {})
test('squashChanges', "([{'new_val':{'a':1, 'id':100}, 'old_val':null}])", 'line 47', {}, {})
test('tbl.changes({squash:null})', "err('ReqlQueryLogicError', 'Expected BOOL or NUMBER but found NULL.')", 'line 56', {}, {})
test('tbl.changes({squash:-10})', "err('ReqlQueryLogicError', 'Expected BOOL or a positive NUMBER but found a negative NUMBER.')", 'line 61', {}, {})


the_end()
