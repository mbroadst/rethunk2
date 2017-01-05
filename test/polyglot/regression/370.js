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

define("r.db('test')", 'd')
test("r.db('test').tableCreate('t370')", "", 'line 5', {}, {})
test('r.dbList().map(r.row)', "(['rethinkdb', 'test'])", 'line 9', {}, {})
test('d.tableList().map(r.row)', "(['t370'])", 'line 14', {}, {})
test("r.db('test').tableDrop('t370')", "", 'line 19', {}, {})


the_end()
