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

test('r.expr(r.epochTime(896571240))', '0', 'line 5', {}, {})
test("r.expr({'stuff':r.epochTime(896571240), 'more':[r.epochTime(996571240)]})", '0', 'line 11', {}, {})
test("r.expr([r.epochTime(796571240), r.epochTime(896571240), {'stuff':r.epochTime(996571240)}])", '0', 'line 17', {}, {})
test("r.expr({'nested':{'time':r.epochTime(896571240)}})", '0', 'line 23', {}, {})
test('r.expr([1, "two", ["a", r.epochTime(896571240), 3]])', '0', 'line 29', {}, {})
test('r.epochTime(1).toEpochTime()', '1', 'line 35', {}, {})
test('r.epochTime(-1).toEpochTime()', '-1', 'line 37', {}, {})
test('r.epochTime(1.4444445).toEpochTime()', '1.444', 'line 39', {}, {})
test('r.epochTime(1.4444445).toISO8601()', '"1970-01-01T00:00:01.444+00:00"', 'line 43', {}, {})
test('r.epochTime(1.4444445).seconds()', '1.444', 'line 45', {}, {})
test('r.epochTime(253430000000).year()', '10000', 'line 48', {}, {})
test('r.epochTime(253430000000).toISO8601()', 'err("ReqlQueryLogicError", "Year `10000` out of valid ISO 8601 range [0, 9999].", [])', 'line 51', {}, {})
test('r.epochTime(253440000000).year()', 'err("ReqlQueryLogicError", "Error in time logic: Year is out of valid range: 1400..10000.", [])', 'line 53', {}, {})
test('r.epochTime(253440000000).toEpochTime()', '253440000000', 'line 55', {}, {})
test('r.epochTime(-17980000000).year()', '1400', 'line 57', {}, {})
test('r.epochTime(-17990000000).year()', 'err("ReqlQueryLogicError", "Error in time logic: Year is out of valid range: 1400..10000.", [])', 'line 59', {}, {})
test('r.epochTime(-17990000000).toEpochTime()', '-17990000000', 'line 61', {}, {})
define('"2013-01-01"', 'cdate')
define('["2013", "2013-01", "2013-01-01", "20130101", "2013-001", "2013001"]', 'dates')
define('"13:00:00"', 'ctime')
define('["13", "13:00", "1300", "13:00:00", "13:00:00.000000", "130000.000000"]', 'times')
define('"+00:00"', 'ctz')
define('["Z", "+00", "+0000", "+00:00"]', 'tzs')
define('[cdate+"T"+ctime+ctz]', 'cdt')
define('["201301", "2013-0101", "2a13", "2013+01", "2013-01-01.1"]', 'badDates')
define('["a3", "13:0000", "13:000", "13:00.00", "130000.00000000a"]', 'badTimes')
define('["X", "-7", "-07:-1", "+07+01", "PST", "UTC", "Z+00"]', 'badTzs')

the_end()
