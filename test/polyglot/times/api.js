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

define('1375147296.6812', 'rt1')
define('r.epochTime(rt1)', 't1')
define('r.epochTime(rt1 + 1000)', 't2')
test('t1.add(1000).toEpochTime()', '(1375148296.681)', 'line 12', {}, {})
test('t1.sub(1000).toEpochTime()', '(1375146296.681)', 'line 15', {}, {})
test('t1.sub(t1.sub(1000))', '1000', 'line 18', {}, {})
test('t1.lt(t1)', 'false', 'line 23', {}, {})
test('t1.le(t1)', 'true', 'line 26', {}, {})
test('(t1.eq(t1))', 'true', 'line 28', {}, {})
test('(t1.ne(t1))', 'false', 'line 31', {}, {})
test('t1.ge(t1)', 'true', 'line 35', {}, {})
test('t1.gt(t1)', 'false', 'line 38', {}, {})
test('t1.lt(t2)', 'true', 'line 41', {}, {})
test('t1.le(t2)', 'true', 'line 44', {}, {})
test('(t1.eq(t2))', 'false', 'line 46', {}, {})
test('(t1.ne(t2))', 'true', 'line 49', {}, {})
test('t1.ge(t2)', 'false', 'line 53', {}, {})
test('t1.gt(t2)', 'false', 'line 56', {}, {})
test('t1.during(t1, t1.add(1000))', 'true', 'line 61', {}, {})
test("t1.during(t1, t1.add(1000), {leftBound:'open'})", 'false', 'line 65', {}, {})
test('t1.during(t1, t1)', 'false', 'line 67', {}, {})
test("t1.during(t1, t1, {rightBound:'closed'})", 'true', 'line 71', {}, {})
test('t1.date().toEpochTime()', '1375142400', 'line 77', {}, {})
test('t1.timeOfDay()', '(4896.681)', 'line 79', {}, {})
test('t1.year()', '2013', 'line 81', {}, {})
test('t1.month()', '7', 'line 83', {}, {})
test('t1.day()', '30', 'line 85', {}, {})
test('t1.dayOfWeek()', '2', 'line 87', {}, {})
test('t1.dayOfYear()', '211', 'line 89', {}, {})
test('t1.hours()', '1', 'line 91', {}, {})
test('t1.minutes()', '21', 'line 93', {}, {})
test('t1.seconds()', '36.681', 'line 95', {}, {})
test('r.time(2013, r.july, 29, 23, 30, 0.1, "-07:00").toEpochTime()', '(1375165800.1)', 'line 99', {}, {})
test('r.time(2013, r.july, 29, 23, 30, 0.1, "-07:00").timezone()', '("-07:00")', 'line 101', {}, {})
test('r.time(2013, r.july, 29, 23, 30, 0.1).toEpochTime()', 'err("ReqlQueryLogicError", "Got 6 arguments to TIME (expected 4 or 7).", [])', 'line 103', {}, {})
test('r.time(2013, r.july, 29, 23, 30, 0.1).timezone()', 'err("ReqlQueryLogicError", "Got 6 arguments to TIME (expected 4 or 7).", [])', 'line 105', {}, {})
test('r.time(2013, r.july, 29, 23, 30).toEpochTime()', 'err("ReqlQueryLogicError", "Got 5 arguments to TIME (expected 4 or 7).", [])', 'line 107', {}, {})
test('r.time(2013, r.july, 29, 23).toEpochTime()', 'err("ReqlQueryLogicError", "Expected type STRING but found NUMBER.", [])', 'line 109', {}, {})
test('r.time(2013, r.july, 29, "-07:00").toEpochTime()', '1375081200', 'line 111', {}, {})
test('r.time(2013, r.july, 29, "-07:00").timezone()', '("-07:00")', 'line 113', {}, {})
test('r.time(2013, r.july, 29).toEpochTime()', 'err("ReqlCompileError", "Expected between 4 and 7 arguments but found 3.", [])', 'line 115', {}, {})
test('r.time(2013, r.july, 29).timezone()', 'err("ReqlCompileError", "Expected between 4 and 7 arguments but found 3.", [])', 'line 117', {}, {})
test('r.ISO8601("2013-07-30T20:56:05-07:00").toEpochTime()', '1375242965', 'line 120', {}, {})
test('r.epochTime(1375242965).inTimezone("-07:00").toISO8601()', '("2013-07-30T20:56:05-07:00")', 'line 123', {}, {})
test('r.now().typeOf()', '("PTYPE<TIME>")', 'line 125', {}, {})
test('r.now().sub(r.now())', '0', 'line 128', {}, {})
test('r.ISO8601("2013-07-30T20:56:05").toISO8601()', 'err("ReqlQueryLogicError", "ISO 8601 string has no time zone, and no default time zone was provided.", [])', 'line 133', {}, {})
test('r.ISO8601("2013-07-30T20:56:05", {"default_timezone":"-07"}).toISO8601()', '("2013-07-30T20:56:05-07:00")', 'line 137', {}, {})
test('r.expr([r.monday, r.tuesday, r.wednesday, r.thursday, r.friday, r.saturday, r.sunday])', '([1, 2, 3, 4, 5, 6, 7])', 'line 140', {}, {})
test('r.expr([r.january, r.february, r.march, r.april, r.may, r.june,\nr.july, r.august, r.september, r.october, r.november, r.december])', '([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])', 'line 142', {}, {})

the_end()
