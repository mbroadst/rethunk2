#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_times_index_js7_2', 'test')
setup_table_check()

define('({"timezone":"-07:00","epoch_time":1375445162.0872,"$reql_type$":"TIME"})', 'ts')
define('({"timezone":"-07:00","epoch_time":1375445163.0872,"$reql_type$":"TIME"})', 't1')
define('({"timezone":"-07:00","epoch_time":1375445163.08832,"$reql_type$":"TIME"})', 't2')
define('({"timezone":"-07:00","epoch_time":1375445163.08943,"$reql_type$":"TIME"})', 't3')
define('({"timezone":"-07:00","epoch_time":1375445163.09055,"$reql_type$":"TIME"})', 't4')
define('({"timezone":"-07:00","epoch_time":1375445163.09166,"$reql_type$":"TIME"})', 't5')
define('({"timezone":"-07:00","epoch_time":1375445164.0872,"$reql_type$":"TIME"})', 'te')
define("[{'id':t1}, {'id':t2}, {'id':t3}, {'id':t4}, {'id':t5}]", 'trows')
test("tbl.insert(trows)('inserted')", '5', 'line 38', {}, {})
define('[{\'id\':r.expr(t1).inTimezone("Z")}]', 'badInsert')
test("tbl.insert(badInsert)('first_error')", '("Duplicate primary key `id`:\\n{\\n\\t\\"id\\":\\t{\\n\\t\\t\\"$reql_type$\\":\\t\\"TIME\\",\\n\\t\\t\\"epoch_time\\":\\t1375445163.087,\\n\\t\\t\\"timezone\\":\\t\\"-07:00\\"\\n\\t}\\n}\\n{\\n\\t\\"id\\":\\t{\\n\\t\\t\\"$reql_type$\\":\\t\\"TIME\\",\\n\\t\\t\\"epoch_time\\":\\t1375445163.087,\\n\\t\\t\\"timezone\\":\\t\\"+00:00\\"\\n\\t}\\n}")', 'line 43', {}, {})
test('tbl.between(ts, te).count()', '5', 'line 46', {}, {})
test('tbl.between(t1, t4).count()', '3', 'line 48', {}, {})
test("tbl.between(t1, t4, {rightBound:'closed'}).count()", '4', 'line 52', {}, {})
test('tbl.between(r.expr(ts).inTimezone("+06:00"), te).count()', '5', 'line 54', {}, {})
test('tbl.between(t1, r.expr(t4).inTimezone("+08:00")).count()', '3', 'line 56', {}, {})
test('tbl.between(r.expr(t1).inTimezone("Z"), t4, {rightBound:\'closed\'}).count()', '4', 'line 60', {}, {})
test("tbl.update(function(row) {return {'a':row('id')}})('replaced')", '5', 'line 65', {}, {})
test("tbl.indexCreate('a')", "({'created':1})", 'line 67', {}, {})
test("tbl.indexWait('a').count()", '1', 'line 69', {}, {})
test("tbl.between(ts, te, {index:'a'}).count()", '5', 'line 74', {}, {})
test("tbl.between(t1, t4, {index:'a'}).count()", '3', 'line 78', {}, {})
test("tbl.between(t1, t4, {rightBound:'closed', index:'a'}).count()", '4', 'line 82', {}, {})
test('tbl.between(r.expr(ts).inTimezone("+06:00"), te, {index:\'a\'}).count()', '5', 'line 86', {}, {})
test('tbl.between(t1, r.expr(t4).inTimezone("+08:00"), {index:\'a\'}).count()', '3', 'line 90', {}, {})
test('tbl.between(r.expr(t1).inTimezone("Z"), t4, {rightBound:\'closed\', index:\'a\'}).count()', '4', 'line 94', {}, {})
test("tbl.indexCreate('b', function(row) { return r.branch(row('id').lt(t4), row('a'), null); })", "({'created':1})", 'line 99', {}, {})
test("tbl.indexWait('b').count()", '1', 'line 101', {}, {})
test("tbl.indexWait('b').count()", '1', 'line 105', {}, {})
test("tbl.between(ts, te, {index:'b'}).count()", '3', 'line 110', {}, {})
test("tbl.between(t1, t4, {index:'b'}).count()", '3', 'line 114', {}, {})
test("tbl.between(t1, t4, {rightBound:'closed', index:'b'}).count()", '3', 'line 118', {}, {})
test('tbl.between(r.expr(ts).inTimezone("+06:00"), te, {index:\'b\'}).count()', '3', 'line 122', {}, {})
test('tbl.between(t1, r.expr(t4).inTimezone("+08:00"), {index:\'b\'}).count()', '3', 'line 126', {}, {})
test('tbl.between(r.expr(t1).inTimezone("Z"), t4, {rightBound:\'closed\', index:\'b\'}).count()', '3', 'line 130', {}, {})
define('(new Date(1375147296.681*1000))', 'oldtime')
define('(new Date())', 'curtime')
test("tbl.insert([{'id':oldtime}])('inserted')", '1', 'line 143', {}, {})
test("tbl.get(oldtime)('id').typeOf()", '("PTYPE<TIME>")', 'line 149', {}, {})

the_end()
