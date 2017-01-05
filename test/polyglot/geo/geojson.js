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

test("r.geojson({'coordinates':[0, 0], 'type':'Point'})", "({'$reql_type$':'GEOMETRY', 'coordinates':[0, 0], 'type':'Point'})", 'line 4', {}, {})
test("r.geojson({'coordinates':[[0,0], [0,1]], 'type':'LineString'})", "({'$reql_type$':'GEOMETRY', 'coordinates':[[0,0], [0,1]], 'type':'LineString'})", 'line 6', {}, {})
test("r.geojson({'coordinates':[[[0,0], [0,1], [1,0], [0,0]]], 'type':'Polygon'})", "({'$reql_type$':'GEOMETRY', 'coordinates':[[[0,0], [0,1], [1,0], [0,0]]], 'type':'Polygon'})", 'line 8', {}, {})
test("r.geojson({'coordinates':[[], 0], 'type':'Point'})", "err('ReqlQueryLogicError', 'Expected type NUMBER but found ARRAY.', [0])", 'line 12', {}, {})
test("r.geojson({'coordinates':true, 'type':'Point'})", "err('ReqlQueryLogicError', 'Expected type ARRAY but found BOOL.', [0])", 'line 14', {}, {})
test("r.geojson({'type':'Point'})", "err('ReqlNonExistenceError', 'No attribute `coordinates` in object:', [0])", 'line 16', {}, {})
test("r.geojson({'coordinates':[0, 0]})", "err('ReqlNonExistenceError', 'No attribute `type` in object:', [0])", 'line 18', {}, {})
test("r.geojson({'coordinates':[0, 0], 'type':'foo'})", "err('ReqlQueryLogicError', 'Unrecognized GeoJSON type `foo`.', [0])", 'line 20', {}, {})
test("r.geojson({'coordinates':[0, 0], 'type':'Point', 'foo':'wrong'})", "err('ReqlQueryLogicError', 'Unrecognized field `foo` found in geometry object.', [0])", 'line 22', {}, {})
test("r.geojson({'coordinates':[0, 0], 'type':'Point', 'crs':null})", "({'$reql_type$':'GEOMETRY', 'coordinates':[0, 0], 'type':'Point', 'crs':null})", 'line 26', {}, {})
test("r.geojson({'coordinates':[0, 0], 'type':'Point', 'crs':{'type':'name', 'properties':{'name':'test'}}})", "err('ReqlQueryLogicError', 'Non-default coordinate reference systems are not supported in GeoJSON objects.  Make sure the `crs` field of the geometry is null or non-existent.', [0])", 'line 28', {}, {})
test("r.geojson({'coordinates':[0, 0], 'type':'MultiPoint'})", "err('ReqlQueryLogicError', 'GeoJSON type `MultiPoint` is not supported.', [0])", 'line 30', {}, {})


the_end()
