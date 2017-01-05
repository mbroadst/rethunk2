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

test('r.dbList()', "bag(['rethinkdb', 'test'])", 'line 6', {}, {})
test("r.dbCreate('a')", "partial({'dbs_created':1})", 'line 11', {}, {})
test("r.dbCreate('b')", "partial({'dbs_created':1})", 'line 13', {}, {})
test('r.dbList()', "bag(['rethinkdb', 'a', 'b', 'test'])", 'line 18', {}, {})
test("r.db('a').config()", "({'name':'a','id':uuid()})", 'line 23', {}, {})
test("r.dbDrop('b')", "partial({'dbs_dropped':1})", 'line 28', {}, {})
test('r.dbList()', "bag(['rethinkdb', 'a', 'test'])", 'line 31', {}, {})
test("r.dbDrop('a')", "partial({'dbs_dropped':1})", 'line 34', {}, {})
test('r.dbList()', "bag(['rethinkdb', 'test'])", 'line 37', {}, {})
test("r.dbCreate('bar')", "partial({'dbs_created':1})", 'line 41', {}, {})
test("r.dbCreate('bar')", "err('ReqlOpFailedError', 'Database `bar` already exists.', [0])", 'line 44', {}, {})
test("r.dbDrop('bar')", "partial({'dbs_dropped':1})", 'line 47', {}, {})
test("r.dbDrop('bar')", "err('ReqlOpFailedError', 'Database `bar` does not exist.', [0])", 'line 50', {}, {})


the_end()
