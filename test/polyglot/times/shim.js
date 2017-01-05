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

define('1375147296.68 * 1000', 't')
test('r(new Date(t)).inTimezone("-07:00").toISO8601()', '("2013-07-29T18:21:36.680-07:00")', 'line 9', {}, {})
test('r(new Date(t)).toISO8601()', '("2013-07-30T01:21:36.680+00:00")', 'line 13', {}, {})
test('r(new Date(t)).toEpochTime()', '(1375147296.68)', 'line 17', {}, {})
test('r(new Date(t)).toEpochTime()', '(1375147296.68)', 'line 21', {}, {})

the_end()
