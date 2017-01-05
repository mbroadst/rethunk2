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

test('r.polygon([0,0], [0,10], [10, 10], [10, 0]).polygonSub(r.polygon([0,0], [0,10], [10, 10], [10, 0])).intersects(r.point(0,0))', '(false)', 'line 3', {}, {})
test('r.polygon([0,0], [0,10], [10, 10], [10, 0]).polygonSub(r.polygon([0,0], [0,10], [10, 10], [10, 0])).intersects(r.polygon([0,0], [0,10], [10, 10], [10, 0]))', '(false)', 'line 5', {}, {})
test('r.polygon([0,0], [0,10], [10, 10], [10, 0]).polygonSub(r.polygon([0,0], [0,10], [10, 10], [10, 0])).intersects(r.line([0,0], [0,10]))', '(false)', 'line 7', {}, {})
test('r.polygon([0,0], [0,10], [10, 10], [10, 0]).intersects(r.polygon([0,0], [0,10], [10, 10], [10, 0]).polygonSub(r.polygon([0,0], [0,10], [10, 10], [10, 0])))', '(false)', 'line 9', {}, {})


the_end()
