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

test("r.distance(r.point(-122, 37), r.point(-123, 37)).coerceTo('STRING')", '("89011.26253835332")', 'line 5', {}, {})
test("r.distance(r.point(-122, 37), r.point(-122, 36)).coerceTo('STRING')", '("110968.30443995494")', 'line 7', {}, {})
test('r.distance(r.point(-122, 37), r.point(-122, 36)).eq(r.distance(r.point(-122, 36), r.point(-122, 37)))', 'true', 'line 9', {}, {})
test("r.point(-122, 37).distance(r.point(-123, 37)).coerceTo('STRING')", '("89011.26253835332")', 'line 11', {}, {})
define('r.distance(r.point(-122, 37), r.point(-123, 37))', 'someDist')
test("someDist.eq(r.distance(r.point(-122, 37), r.point(-123, 37), {unit:'m'}))", 'true', 'line 14', {}, {})
test("someDist.mul(1.0/1000.0).eq(r.distance(r.point(-122, 37), r.point(-123, 37), {unit:'km'}))", 'true', 'line 18', {}, {})
test("someDist.mul(1.0/1609.344).eq(r.distance(r.point(-122, 37), r.point(-123, 37), {unit:'mi'}))", 'true', 'line 22', {}, {})
test("someDist.mul(1.0/0.3048).eq(r.distance(r.point(-122, 37), r.point(-123, 37), {unit:'ft'}))", 'true', 'line 26', {}, {})
test("someDist.mul(1.0/1852.0).eq(r.distance(r.point(-122, 37), r.point(-123, 37), {unit:'nm'}))", 'true', 'line 30', {}, {})
test("someDist.eq(r.distance(r.point(-122, 37), r.point(-123, 37), {'geo_system':'WGS84'}))", 'true', 'line 34', {}, {})
test("someDist.div(10).eq(r.distance(r.point(-122, 37), r.point(-123, 37), {'geo_system':{'a':637813.7, 'f':(1.0/298.257223563)}}))", 'true', 'line 39', {}, {})
test("r.distance(r.point(-122, 37), r.point(-123, 37), {'geo_system':'unit_sphere'}).coerceTo('STRING')", '("0.01393875509649327")', 'line 45', {}, {})
test("r.distance(r.point(0, 0), r.point(0, 0)).coerceTo('STRING')", '("0")', 'line 47', {}, {})
test("r.distance(r.point(0, 0), r.point(180, 0)).mul(2).coerceTo('STRING')", '("40007862.917250897")', 'line 50', {}, {})
test("r.distance(r.point(0, -90), r.point(0, 90)).mul(2).coerceTo('STRING')", '("40007862.917250897")', 'line 52', {}, {})
test("r.distance(r.point(0, 0), r.line([0,0], [0,1])).coerceTo('STRING')", '("0")', 'line 54', {}, {})
test("r.distance(r.line([0,0], [0,1]), r.point(0, 0)).coerceTo('STRING')", '("0")', 'line 56', {}, {})
test('r.distance(r.point(0, 0), r.line([0.1,0], [1,0])).eq(r.distance(r.point(0, 0), r.point(0.1, 0)))', 'true', 'line 58', {}, {})
test("r.distance(r.point(0, 0), r.line([5,-1], [4,2])).coerceTo('STRING')", '("492471.4990055255")', 'line 60', {}, {})
test("r.distance(r.point(0, 0), r.polygon([5,-1], [4,2], [10,10])).coerceTo('STRING')", '("492471.4990055255")', 'line 62', {}, {})
test("r.distance(r.point(0, 0), r.polygon([0,-1], [0,1], [10,10])).coerceTo('STRING')", '("0")', 'line 64', {}, {})
test("r.distance(r.point(0.5, 0.5), r.polygon([0,-1], [0,1], [10,10])).coerceTo('STRING')", '("0")', 'line 66', {}, {})
test('r.circle([0,0], 1, {fill:false}).eq(r.circle([0,0], 1, {fill:true}))', 'false', 'line 70', {}, {})
test('r.circle([0,0], 1, {fill:false}).fill().eq(r.circle([0,0], 1, {fill:true}))', 'true', 'line 74', {}, {})
test('r.polygon([0,0], [1,0], [1,1], [0,1]).polygonSub(r.polygon([0.1,0.1], [0.9,0.1], [0.9,0.9], [0.1,0.9]))', "({'$reql_type$':'GEOMETRY', 'coordinates':[[[0,0],[1,0],[1,1],[0,1],[0,0]],[[0.1,0.1],[0.9,0.1],[0.9,0.9],[0.1,0.9],[0.1,0.1]]], 'type':'Polygon'})", 'line 80', {}, {})
test('r.polygon([0,0], [1,0], [1,1], [0,1]).polygonSub(r.polygon([0.1,0.9], [0.9,0.0], [0.9,0.9], [0.1,0.9]))', "err('ReqlQueryLogicError', 'The second argument to `polygon_sub` is not contained in the first one.', [0])", 'line 82', {}, {})
test('r.polygon([0,0], [1,0], [1,1], [0,1]).polygonSub(r.polygon([0,0], [2,0], [2,2], [0,2]))', "err('ReqlQueryLogicError', 'The second argument to `polygon_sub` is not contained in the first one.', [0])", 'line 84', {}, {})
test('r.polygon([0,0], [1,0], [1,1], [0,1]).polygonSub(r.polygon([0,-2], [1,-2], [-1,1], [0,-1]))', "err('ReqlQueryLogicError', 'The second argument to `polygon_sub` is not contained in the first one.', [0])", 'line 86', {}, {})
test('r.polygon([0,0], [1,0], [1,1], [0,1]).polygonSub(r.polygon([0,-1], [1,-1], [1,0], [0,0]))', "err('ReqlQueryLogicError', 'The second argument to `polygon_sub` is not contained in the first one.', [0])", 'line 88', {}, {})
test('r.polygon([0,0], [1,0], [1,1], [0,1]).polygonSub(r.polygon([0.1,-1], [0.9,-1], [0.9,0.5], [0.1,0.5]))', "err('ReqlQueryLogicError', 'The second argument to `polygon_sub` is not contained in the first one.', [0])", 'line 90', {}, {})
test('r.polygon([0,0], [1,0], [1,1], [0,1]).polygonSub(r.polygon([0,0],[0.1,0.9],[0.9,0.9],[0.9,0.1]))', "({'$reql_type$':'GEOMETRY', 'coordinates':[[[0,0],[1,0],[1,1],[0,1],[0,0]],[[0,0],[0.1,0.9],[0.9,0.9],[0.9,0.1],[0,0]]], 'type':'Polygon'})", 'line 92', {}, {})
test('r.polygon([0,0], [1,0], [1,1], [0,1]).polygonSub(r.polygon([0,0],[0.1,0.9],[0.9,0.9],[0.9,0.1]).polygonSub(r.polygon([0.2,0.2],[0.5,0.8],[0.8,0.2])))', "err('ReqlQueryLogicError', 'Expected a Polygon with only an outer shell.  This one has holes.', [0])", 'line 94', {}, {})
test('r.polygon([0,0], [1,0], [1,1], [0,1]).polygonSub(r.line([0,0],[0.9,0.1],[0.9,0.9],[0.1,0.9]))', "err('ReqlQueryLogicError', 'Expected a Polygon but found a LineString.', [])", 'line 96', {}, {})


the_end()
