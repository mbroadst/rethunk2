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

define("r.db('test').table('t665')", 't')
test("r.db('test').tableCreate('t665')", "", 'line 4', {}, {})
test("t.insert([{'id':1}, {'id':4}])", "({'unchanged':0,\n'skipped':0,\n'replaced':0,\n'inserted':2,\n'errors':0,\n'deleted':0\n})", 'line 9', {}, {})
test("r.db('test').tableDrop('t665')", "", 'line 19', {}, {})


the_end()
