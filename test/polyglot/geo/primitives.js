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

test('r.circle([0,0], 1, {numVertices:3})', "({'$reql_type$':'GEOMETRY', 'coordinates':[[[0, -9.04369477050382e-06], [-7.779638566553426e-06, 4.5218473852518965e-06], [7.779638566553426e-06, 4.5218473852518965e-06], [0, -9.04369477050382e-06]]], 'type':'Polygon'})", 'line 4', {}, {})
test('r.circle(r.point(0,0), 1, {numVertices:3})', "({'$reql_type$':'GEOMETRY', 'coordinates':[[[0, -9.04369477050382e-06], [-7.779638566553426e-06, 4.5218473852518965e-06], [7.779638566553426e-06, 4.5218473852518965e-06], [0, -9.04369477050382e-06]]], 'type':'Polygon'})", 'line 9', {}, {})
test('r.circle([0,0], 1, {numVertices:3, fill:false})', "({'$reql_type$':'GEOMETRY', 'coordinates':[[0, -9.04369477050382e-06], [-7.779638566553426e-06, 4.5218473852518965e-06], [7.779638566553426e-06, 4.5218473852518965e-06], [0, -9.04369477050382e-06]], 'type':'LineString'})", 'line 14', {}, {})
test('r.circle([0,0], 14000000, {numVertices:3})', "err('ReqlQueryLogicError', 'Radius must be smaller than a quarter of the circumference along the minor axis of the reference ellipsoid.  Got 14000000m, but must be smaller than 9985163.1855612862855m.', [0])", 'line 19', {}, {})
test("r.circle([0,0], 1, {numVertices:3, geoSystem:'WGS84'})", "({'$reql_type$':'GEOMETRY', 'coordinates':[[[0, -9.04369477050382e-06], [-7.779638566553426e-06, 4.5218473852518965e-06], [7.779638566553426e-06, 4.5218473852518965e-06], [0, -9.04369477050382e-06]]], 'type':'Polygon'})", 'line 24', {}, {})
test("r.circle([0,0], 2, {numVertices:3, geoSystem:'unit_'+'sphere'})", "err('ReqlQueryLogicError', 'Radius must be smaller than a quarter of the circumference along the minor axis of the reference ellipsoid.  Got 2m, but must be smaller than 1.570796326794896558m.', [0])", 'line 29', {}, {})
test("r.circle([0,0], 0.1, {numVertices:3, geoSystem:'unit_'+'sphere'})", "({'$reql_type$':'GEOMETRY', 'coordinates':[[[0, -5.729577951308232], [-4.966092947444857, 2.861205754495701], [4.966092947444857, 2.861205754495701], [0, -5.729577951308232]]], 'type':'Polygon'})", 'line 34', {}, {'precision': '0.0000000000001'})
test("r.circle([0,0], 1.0/1000.0, {numVertices:3, unit:'km'})", "({'$reql_type$':'GEOMETRY', 'coordinates':[[[0, -9.04369477050382e-06], [-7.779638566553426e-06, 4.5218473852518965e-06], [7.779638566553426e-06, 4.5218473852518965e-06], [0, -9.04369477050382e-06]]], 'type':'Polygon'})", 'line 41', {}, {})
test("r.circle([0,0], 1.0/1609.344, {numVertices:3, unit:'mi'})", "({'$reql_type$':'GEOMETRY', 'coordinates':[[[0, -9.04369477050382e-06], [-7.779638566553426e-06, 4.5218473852518965e-06], [7.779638566553426e-06, 4.5218473852518965e-06], [0, -9.04369477050382e-06]]], 'type':'Polygon'})", 'line 46', {}, {})


the_end()
