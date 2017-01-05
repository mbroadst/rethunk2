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

test('r.point(0, 0)', "({'$reql_type$':'GEOMETRY', 'coordinates':[0, 0], 'type':'Point'})", 'line 4', {}, {})
test('r.point(0, -90)', "({'$reql_type$':'GEOMETRY', 'coordinates':[0, -90], 'type':'Point'})", 'line 6', {}, {})
test('r.point(0, 90)', "({'$reql_type$':'GEOMETRY', 'coordinates':[0, 90], 'type':'Point'})", 'line 8', {}, {})
test('r.point(-180, 0)', "({'$reql_type$':'GEOMETRY', 'coordinates':[-180, 0], 'type':'Point'})", 'line 10', {}, {})
test('r.point(180, 0)', "({'$reql_type$':'GEOMETRY', 'coordinates':[180, 0], 'type':'Point'})", 'line 12', {}, {})
test('r.point(0, -91)', "err('ReqlQueryLogicError', 'Latitude must be between -90 and 90.  Got -91.', [0])", 'line 14', {}, {})
test('r.point(0, 91)', "err('ReqlQueryLogicError', 'Latitude must be between -90 and 90.  Got 91.', [0])", 'line 16', {}, {})
test('r.point(-181, 0)', "err('ReqlQueryLogicError', 'Longitude must be between -180 and 180.  Got -181.', [0])", 'line 18', {}, {})
test('r.point(181, 0)', "err('ReqlQueryLogicError', 'Longitude must be between -180 and 180.  Got 181.', [0])", 'line 20', {}, {})
test('r.line()', "err('ReqlCompileError', 'Expected 2 or more arguments but found 0.', [0])", 'line 24', {}, {})
test('r.line([0,0])', "err('ReqlCompileError', 'Expected 2 or more arguments but found 1.', [0])", 'line 26', {}, {})
test('r.line([0,0], [0,0])', "err('ReqlQueryLogicError', 'Invalid LineString.  Are there antipodal or duplicate vertices?', [0])", 'line 28', {}, {})
test('r.line([0,0], [0,1])', "({'$reql_type$':'GEOMETRY', 'coordinates':[[0,0], [0,1]], 'type':'LineString'})", 'line 30', {}, {})
test('r.line([0,0], [1])', "err('ReqlQueryLogicError', 'Expected point coordinate pair.  Got 1 element array instead of a 2 element one.', [0])", 'line 32', {}, {})
test('r.line([0,0], [1,0,0])', "err('ReqlQueryLogicError', 'Expected point coordinate pair.  Got 3 element array instead of a 2 element one.', [0])", 'line 34', {}, {})
test('r.line([0,0], [0,1], [0,0])', "({'$reql_type$':'GEOMETRY', 'coordinates':[[0,0], [0,1], [0,0]], 'type':'LineString'})", 'line 36', {}, {})
test('r.line(r.point(0,0), r.point(0,1), r.point(0,0))', "({'$reql_type$':'GEOMETRY', 'coordinates':[[0,0], [0,1], [0,0]], 'type':'LineString'})", 'line 38', {}, {})
test('r.line(r.point(0,0), r.point(1,0), r.line([0,0], [1,0]))', "err('ReqlQueryLogicError', 'Expected geometry of type `Point` but found `LineString`.', [0])", 'line 40', {}, {})
test('r.polygon()', "err('ReqlCompileError', 'Expected 3 or more arguments but found 0.', [0])", 'line 44', {}, {})
test('r.polygon([0,0])', "err('ReqlCompileError', 'Expected 3 or more arguments but found 1.', [0])", 'line 46', {}, {})
test('r.polygon([0,0], [0,0])', "err('ReqlCompileError', 'Expected 3 or more arguments but found 2.', [0])", 'line 48', {}, {})
test('r.polygon([0,0], [0,0], [0,0], [0,0])', "err('ReqlQueryLogicError', 'Invalid LinearRing.  Are there antipodal or duplicate vertices? Is it self-intersecting?', [0])", 'line 50', {}, {})
test('r.polygon([0,0], [0,1], [1,0])', "({'$reql_type$':'GEOMETRY', 'coordinates':[[[0,0], [0,1], [1,0], [0,0]]], 'type':'Polygon'})", 'line 52', {}, {})
test('r.polygon([0,0], [0,1], [1,0], [0,0])', "({'$reql_type$':'GEOMETRY', 'coordinates':[[[0,0], [0,1], [1,0], [0,0]]], 'type':'Polygon'})", 'line 54', {}, {})
test('r.polygon([0,0], [0,1], [1,0], [-1,0.5])', "err('ReqlQueryLogicError', 'Invalid LinearRing.  Are there antipodal or duplicate vertices? Is it self-intersecting?', [0])", 'line 56', {}, {})
test('r.polygon([0,0], [0,1], [0])', "err('ReqlQueryLogicError', 'Expected point coordinate pair.  Got 1 element array instead of a 2 element one.', [0])", 'line 58', {}, {})
test('r.polygon([0,0], [0,1], [0,1,0])', "err('ReqlQueryLogicError', 'Expected point coordinate pair.  Got 3 element array instead of a 2 element one.', [0])", 'line 60', {}, {})
test('r.polygon(r.point(0,0), r.point(0,1), r.line([0,0], [0,1]))', "err('ReqlQueryLogicError', 'Expected geometry of type `Point` but found `LineString`.', [0])", 'line 62', {}, {})


the_end()
