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

define('1375147296.681', 'rt1')
define('1375147296.682', 'rt2')
define('1375147297.681', 'rt3')
define('2375147296.681', 'rt4')
define('[rt1, rt2, rt3, rt4]', 'rts')
define('r.epochTime(rt1)', 't1')
define('r.epochTime(rt2)', 't2')
define('r.epochTime(rt3)', 't3')
define('r.epochTime(rt4)', 't4')
define('r.expr([t1, t2, t3, t4])', 'ts')
test('ts.map(r.row.date()).map(r.row.toEpochTime())', '([1375142400, 1375142400, 1375142400, 2375136000])', 'line 17', {}, {})
test('ts.map(r.row.date().timeOfDay())', '([0, 0, 0, 0])', 'line 21', {}, {})
test('ts.map(r.row.timeOfDay())', '([4896.681, 4896.682, 4897.681, 11296.681])', 'line 25', {}, {})
test('ts.map([r.row.year(), r.row.month(), r.row.day(), r.row.hours(), r.row.minutes(), r.row.seconds()])', '([[2013, 7, 30, 1, 21, 36.681],\n[2013, 7, 30, 1, 21, 36.682],\n[2013, 7, 30, 1, 21, 37.681],\n[2045, 4, 7, 3, 8, 16.681]])', 'line 30', {}, {})
test('ts.map(r.time(r.row.year(), r.row.month(), r.row.day(), r.row.hours(), r.row.minutes(), r.row.seconds(), r.row.timezone())).map(r.row.toEpochTime())', 'rts', 'line 37', {}, {})
test('ts.map(r.time(r.row.year(), r.row.month(), r.row.day(), r.row.hours(), r.row.minutes(), r.row.seconds(), r.row.timezone())).union(ts).map(r.row.toISO8601()).distinct().count().sub(ts.count())', '0', 'line 41', {}, {})
test('ts.map([r.row.dayOfWeek(), r.row.dayOfYear()])', '[[2, 211], [2, 211], [2, 211], [5, 97]]', 'line 44', {}, {})

the_end()
