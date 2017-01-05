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

test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.point(1.5,1.5))', 'true', 'line 4', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.point(2.5,2.5))', 'false', 'line 6', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).polygonSub(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9])).intersects(r.point(1.5,1.5))', 'false', 'line 8', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).polygonSub(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9])).intersects(r.point(1.05,1.05))', 'true', 'line 10', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.point(2,2))', 'true', 'line 13', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.point(2,1.5))', 'true', 'line 15', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.line([1.5,1.5], [2,2]))', 'true', 'line 17', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.line([1.5,1.5], [2,1.5]))', 'true', 'line 19', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).polygonSub(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9])).intersects(r.point(1.1,1.1))', 'true', 'line 22', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).polygonSub(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9])).intersects(r.point(1.5,1.1))', 'true', 'line 24', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.line([2,2], [3,3]))', 'false', 'line 27', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.line([2,1.5], [3,3]))', 'false', 'line 29', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.line([1.5,1.5], [3,3]))', 'true', 'line 31', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.polygon([1.2,1.2], [1.8,1.2], [1.8,1.8], [1.2,1.8]))', 'true', 'line 33', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.polygon([1.5,1.5], [2.5,1.5], [2.5,2.5], [1.5,2.5]))', 'true', 'line 35', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).polygonSub(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9])).intersects(r.polygon([1.2,1.2], [1.8,1.2], [1.8,1.8], [1.2,1.8]))', 'false', 'line 37', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).polygonSub(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9])).intersects(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9]))', 'false', 'line 39', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.polygon([2,1.1], [3,1.1], [3,1.9], [2,1.9]))', 'true', 'line 42', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).intersects(r.polygon([2,2], [3,2], [3,3], [2,3]))', 'false', 'line 44', {}, {})
test('r.point(1,1).intersects(r.point(1.5,1.5))', 'false', 'line 46', {}, {})
test('r.point(1,1).intersects(r.point(1,1))', 'true', 'line 48', {}, {})
test('r.line([1,1], [2,1]).intersects(r.point(1,1))', 'true', 'line 50', {}, {})
test('r.line([1,1], [1,2]).intersects(r.point(1,1.8))', 'true', 'line 55', {}, {})
test('r.line([1,0], [2,0]).intersects(r.point(1.8,0))', 'true', 'line 57', {}, {})
test('r.line([1,1], [2,1]).intersects(r.point(1.5,1.5))', 'false', 'line 59', {}, {})
test('r.line([1,1], [2,1]).intersects(r.line([2,1], [3,1]))', 'true', 'line 61', {}, {})
test('r.expr([r.point(1, 0), r.point(3,0), r.point(2, 0)]).intersects(r.line([0,0], [2, 0])).count()', '2', 'line 64', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.point(1.5,1.5))', 'true', 'line 68', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.point(2.5,2.5))', 'false', 'line 70', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).polygonSub(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9])).includes(r.point(1.5,1.5))', 'false', 'line 72', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).polygonSub(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9])).includes(r.point(1.05,1.05))', 'true', 'line 74', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.point(2,2))', 'true', 'line 76', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.point(2,1.5))', 'true', 'line 78', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.line([1.5,1.5], [2,2]))', 'true', 'line 80', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.line([1.5,1.5], [2,1.5]))', 'true', 'line 82', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).polygonSub(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9])).includes(r.point(1.1,1.1))', 'true', 'line 84', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).polygonSub(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9])).includes(r.point(1.5,1.1))', 'true', 'line 86', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.line([2,2], [3,3]))', 'false', 'line 88', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.line([2,1.5], [2,2]))', 'true', 'line 90', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.line([2,1], [2,2]))', 'true', 'line 92', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.line([1.5,1.5], [3,3]))', 'false', 'line 94', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.polygon([1,1], [2,1], [2,2], [1,2]))', 'true', 'line 96', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.polygon([1.2,1.2], [1.8,1.2], [1.8,1.8], [1.2,1.8]))', 'true', 'line 98', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.polygon([1.5,1.5], [2,1.5], [2,2], [1.5,2]))', 'true', 'line 100', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.polygon([1.5,1.5], [2.5,1.5], [2.5,2.5], [1.5,2.5]))', 'false', 'line 102', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).polygonSub(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9])).includes(r.polygon([1.2,1.2], [1.8,1.2], [1.8,1.8], [1.2,1.8]))', 'false', 'line 104', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).polygonSub(r.polygon([1.1,1.1], [1.9,1.1], [1.9,1.9], [1.1,1.9])).includes(r.polygon([1.1,1.1], [2,1.1], [2,2], [1.1,2]))', 'false', 'line 106', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.polygon([2,1.1], [3,1.1], [3,1.9], [2,1.9]))', 'false', 'line 108', {}, {})
test('r.polygon([1,1], [2,1], [2,2], [1,2]).includes(r.polygon([2,2], [3,2], [3,3], [2,3]))', 'false', 'line 110', {}, {})
test('r.expr([r.polygon([0,0], [1,1], [1,0]), r.polygon([0,1], [1,2], [1,1])]).includes(r.point(0,0)).count()', '1', 'line 113', {}, {})
test('r.point(0,0).includes(r.point(0,0))', "err('ReqlQueryLogicError', 'Expected geometry of type `Polygon` but found `Point`.')", 'line 116', {}, {})
test('r.line([0,0], [0,1]).includes(r.point(0,0))', "err('ReqlQueryLogicError', 'Expected geometry of type `Polygon` but found `LineString`.')", 'line 118', {}, {})


the_end()
