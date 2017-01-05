#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_3449_js7_2', 'test')
setup_table_check()

test('tbl.insert([{id: 0}, {id: 1}, {id: 2}, {id: 3}])', "({'skipped':0, 'deleted':0, 'unchanged':0, 'errors':0, 'replaced':0, 'inserted':4})", 'line 4', {}, {})
test("tbl.between(1, 3).orderBy({index: r.asc('id')})", '[{id:1}, {id:2}]', 'line 8', {}, {})
test("tbl.between(1, 3).orderBy({index: r.desc('id')})", '[{id:2}, {id:1}]', 'line 10', {}, {})
test("tbl.between(1, 3, {leftBound: 'open'}).orderBy({index: r.asc('id')})", '[{id:2}]', 'line 13', {}, {})
test("tbl.between(1, 3, {leftBound: 'open'}).orderBy({index: r.desc('id')})", '[{id:2}]', 'line 15', {}, {})
test("tbl.between(1, 3, {leftBound: 'open', rightBound: 'closed'}).orderBy({index: r.asc('id')})", '[{id:2}, {id:3}]', 'line 18', {}, {})
test("tbl.between(1, 3, {leftBound: 'open', rightBound: 'closed'}).orderBy({index: r.desc('id')})", '[{id:3}, {id:2}]', 'line 20', {}, {})


the_end()
