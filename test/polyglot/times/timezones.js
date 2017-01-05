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

define('r.time(2013, r.july, 29, 23, 30, 0, "+00:00")', 't1')
define('t1.inTimezone("Z")', 'tutc1')
define('t1.inTimezone("+00:00")', 'tutc2')
define('t1.inTimezone("+00")', 'tutc3')
define('r.expr([tutc1, tutc2, tutc3])', 'tutcs')
define('t1.inTimezone("-00:59")', 'tm1')
define('t1.inTimezone("-01:00")', 'tm2')
define('t1.inTimezone("-01:01")', 'tm3')
define('r.expr([tm1, tm2, tm3])', 'tms')
define('t1.inTimezone("+00:59")', 'tp1')
define('t1.inTimezone("+01:00")', 'tp2')
define('t1.inTimezone("+01:01")', 'tp3')
define('r.expr([tp1, tp2, tp3])', 'tps')
define('tutcs.union(tms).union(tps).union([t1])', 'ts')
test('tutcs.map([r.row.timezone(), r.row.day()])', '([["+00:00", 29], ["+00:00", 29], ["+00:00", 29]])', 'line 24', {}, {})
test('tms.map([r.row.timezone(), r.row.day()])', '([["-00:59", 29], ["-01:00", 29], ["-01:01", 29]])', 'line 28', {}, {})
test('tps.map([r.row.timezone(), r.row.day()])', '([["+00:59", 30], ["+01:00", 30], ["+01:01", 30]])', 'line 32', {}, {})
test('ts.concatMap(function(x) { return ts.map(function(y) { return x.sub(y); }); }).distinct()', '([0])', 'line 39', {}, {})
test('r.now().inTimezone("")', "err('ReqlQueryLogicError', 'Timezone `` does not start with `-` or `+`.')", 'line 44', {}, {})
test('r.now().inTimezone("-00")', "err('ReqlQueryLogicError', '`-00` is not a valid time offset.')", 'line 47', {}, {})
test('r.now().inTimezone("-00:00")', "err('ReqlQueryLogicError', '`-00:00` is not a valid time offset.')", 'line 50', {}, {})
test('r.now().inTimezone("UTC+00")', "err('ReqlQueryLogicError', 'Timezone `UTC+00` does not start with `-` or `+`.')", 'line 53', {}, {})
test('r.now().inTimezone("+00:60")', "err('ReqlQueryLogicError', 'Minutes out of range in `+00:60`.')", 'line 56', {}, {})
test('r.now().inTimezone("+25:00")', "err('ReqlQueryLogicError', 'Hours out of range in `+25:00`.')", 'line 59', {}, {})
test('r.time(2013, 1, 1, "")', "err('ReqlQueryLogicError', 'Timezone `` does not start with `-` or `+`.')", 'line 63', {}, {})
test('r.time(2013, 1, 1, "-00")', "err('ReqlQueryLogicError', '`-00` is not a valid time offset.')", 'line 66', {}, {})
test('r.time(2013, 1, 1, "-00:00")', "err('ReqlQueryLogicError', '`-00:00` is not a valid time offset.')", 'line 69', {}, {})
test('r.time(2013, 1, 1, "UTC+00")', "err('ReqlQueryLogicError', 'Timezone `UTC+00` does not start with `-` or `+`.')", 'line 72', {}, {})
test('r.time(2013, 1, 1, "+00:60")', "err('ReqlQueryLogicError', 'Minutes out of range in `+00:60`.')", 'line 75', {}, {})
test('r.time(2013, 1, 1, "+25:00")', "err('ReqlQueryLogicError', 'Hours out of range in `+25:00`.')", 'line 78', {}, {})
test("r.epochTime(1436428422.339).inTimezone('-08:00').date().toISO8601()", '("2015-07-08T00:00:00-08:00")', 'line 82', {}, {})
test("r.epochTime(1436428422.339).inTimezone('-07:00').date().toISO8601()", '("2015-07-09T00:00:00-07:00")', 'line 86', {}, {})


the_end()
