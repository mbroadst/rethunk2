#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_geo_indexing_js7_2', 'test')
setup_table_check()

define("[{'id':0, 'g':r.point(10,10), 'm':[r.point(0,0),r.point(1,0),r.point(2,0)]},\n{'id':1, 'g':r.polygon([0,0], [0,1], [1,1], [1,0])},\n{'id':2, 'g':r.line([0.000002,-1], [-0.000001,1])}]", 'rows')
test('tbl.insert(rows)', "({'deleted':0,'inserted':3,'skipped':0,'errors':0,'replaced':0,'unchanged':0})", 'line 8', {}, {})
test("tbl.indexCreate('g', {'geo':true})", "({'created':1})", 'line 13', {}, {})
test("tbl.indexCreate('m', {'geo':true, 'multi':true})", "({'created':1})", 'line 17', {}, {})
test("tbl.indexCreate('other')", "({'created':1})", 'line 19', {}, {})
test("tbl.indexCreate('point_det', function(x) {return r.point(x, x);} )", "({'created':1})", 'line 24', {}, {})
test('tbl.indexWait()', "", 'line 27', {}, {})
test("tbl.indexCreate('point_det', function(x) {return r.line(x, x);} )", "err('ReqlQueryLogicError', 'Could not prove function deterministic.  Index functions must be deterministic.')", 'line 33', {}, {})
test("tbl.getIntersecting(r.point(0,0), {'index':'other'}).count()", "err('ReqlQueryLogicError', 'Index `other` is not a geospatial index.  get_intersecting can only be used with a geospatial index.', [0])", 'line 36', {}, {})
test("tbl.getIntersecting(r.point(0,0), {'index':'missing'}).count()", "err_regex('ReqlOpFailedError', 'Index `missing` was not found on table `[a-zA-Z0-9_]+.[a-zA-Z0-9_]+`[.]', [0])", 'line 40', {}, {})
test('tbl.getIntersecting(r.point(0,0)).count()', "err('ReqlQueryLogicError', 'get_intersecting requires an index argument.', [0])", 'line 44', {}, {})
test("tbl.getAll(0, {'index':'g'}).count()", "err('ReqlQueryLogicError', 'Index `g` is a geospatial index.  Only get_nearest and get_intersecting can use a geospatial index.', [0])", 'line 46', {}, {})
test("tbl.between(0, 1, {'index':'g'}).count()", "err('ReqlQueryLogicError', 'Index `g` is a geospatial index.  Only get_nearest and get_intersecting can use a geospatial index.', [0])", 'line 50', {}, {})
test("tbl.orderBy({'index':'g'}).count()", "err('ReqlQueryLogicError', 'Index `g` is a geospatial index.  Only get_nearest and get_intersecting can use a geospatial index.', [0])", 'line 54', {}, {})
test("tbl.between(0, 1).getIntersecting(r.point(0,0), {'index':'g'}).count()", "err('ReqlQueryLogicError', 'Expected type TABLE but found TABLE_SLICE:', [0])", 'line 58', {}, {})
test("tbl.getAll(0).getIntersecting(r.point(0,0), {'index':'g'}).count()", "err('ReqlQueryLogicError', 'Expected type TABLE but found SELECTION:', [0])", 'line 64', {}, {})
test("tbl.orderBy({'index':'id'}).getIntersecting(r.point(0,0), {'index':'g'}).count()", "err('ReqlQueryLogicError', 'Expected type TABLE but found TABLE_SLICE:', [0])", 'line 70', {}, {})
test("tbl.getIntersecting(r.point(0,0), {'index':'id'}).count()", "err('ReqlQueryLogicError', 'get_intersecting cannot use the primary index.', [0])", 'line 76', {}, {})
test("tbl.getIntersecting(r.point(0,0), {'index':'g'}).count()", '1', 'line 81', {}, {})
test("tbl.getIntersecting(r.point(10,10), {'index':'g'}).count()", '1', 'line 85', {}, {})
test("tbl.getIntersecting(r.point(0.5,0.5), {'index':'g'}).count()", '1', 'line 89', {}, {})
test("tbl.getIntersecting(r.point(20,20), {'index':'g'}).count()", '0', 'line 93', {}, {})
test("tbl.getIntersecting(r.polygon([0,0], [1,0], [1,1], [0,1]), {'index':'g'}).count()", '2', 'line 97', {}, {})
test("tbl.getIntersecting(r.line([0,0], [10,10]), {'index':'g'}).count()", '3', 'line 101', {}, {})
test("tbl.getIntersecting(r.point(0,0), {'index':'g'}).typeOf()", '("SELECTION<STREAM>")', 'line 105', {}, {})
test("tbl.getIntersecting(r.point(0,0), {'index':'g'}).filter(true).typeOf()", '("SELECTION<STREAM>")', 'line 109', {}, {})
test("tbl.getIntersecting(r.point(0,0), {'index':'g'}).map(r.row).typeOf()", '("STREAM")', 'line 113', {}, {})
test("tbl.getIntersecting(r.point(0,0), {'index':'m'}).count()", '1', 'line 118', {}, {})
test("tbl.getIntersecting(r.point(1,0), {'index':'m'}).count()", '1', 'line 122', {}, {})
test("tbl.getIntersecting(r.point(2,0), {'index':'m'}).count()", '1', 'line 126', {}, {})
test("tbl.getIntersecting(r.point(3,0), {'index':'m'}).count()", '0', 'line 130', {}, {})
test("tbl.getIntersecting(r.polygon([0,0], [0,1], [1,1], [1,0]), {'index':'m'}).count()", '2', 'line 135', {}, {})
test("tbl.getNearest(r.point(0,0), {'index':'other'})", "err('ReqlQueryLogicError', 'Index `other` is not a geospatial index.  get_nearest can only be used with a geospatial index.', [0])", 'line 141', {}, {})
test("tbl.getNearest(r.point(0,0), {'index':'missing'})", "err_regex('ReqlOpFailedError', 'Index `missing` was not found on table `[a-zA-Z0-9_]+.[a-zA-Z0-9_]+`[.]', [0])", 'line 145', {}, {})
test('tbl.getNearest(r.point(0,0))', "err('ReqlQueryLogicError', 'get_nearest requires an index argument.', [0])", 'line 149', {}, {})
test("tbl.between(0, 1).getNearest(r.point(0,0), {'index':'g'}).count()", "err('ReqlQueryLogicError', 'Expected type TABLE but found TABLE_SLICE:', [0])", 'line 151', {}, {})
test("tbl.getAll(0).getNearest(r.point(0,0), {'index':'g'}).count()", "err('ReqlQueryLogicError', 'Expected type TABLE but found SELECTION:', [0])", 'line 157', {}, {})
test("tbl.orderBy({'index':'id'}).getNearest(r.point(0,0), {'index':'g'}).count()", "err('ReqlQueryLogicError', 'Expected type TABLE but found TABLE_SLICE:', [0])", 'line 163', {}, {})
test("tbl.getNearest(r.point(0,0), {'index':'id'}).count()", "err('ReqlQueryLogicError', 'get_nearest cannot use the primary index.', [0])", 'line 169', {}, {})
test("tbl.getNearest(r.point(0,0), {'index':'g'}).pluck('dist', {'doc':'id'})", "([{'dist':0,'doc':{'id':1}},{'dist':0.055659745396754216,'doc':{'id':2}}])", 'line 174', {}, {})
test("tbl.getNearest(r.point(-0.000001,1), {'index':'g'}).pluck('dist', {'doc':'id'})", "([{'dist':0,'doc':{'id':2}},{'dist':0.11130264976984369,'doc':{'id':1}}])", 'line 178', {}, {})
test("tbl.getNearest(r.point(0,0), {'index':'g', 'max_dist':1565110}).pluck('dist', {'doc':'id'})", "([{'dist':0,'doc':{'id':1}},{'dist':0.055659745396754216,'doc':{'id':2}},{'dist':1565109.0992178896,'doc':{'id':0}}])", 'line 182', {}, {})
test("tbl.getNearest(r.point(0,0), {'index':'g', 'max_dist':1565110, 'max_results':2}).pluck('dist', {'doc':'id'})", "([{'dist':0,'doc':{'id':1}},{'dist':0.055659745396754216,'doc':{'id':2}}])", 'line 186', {}, {})
test("tbl.getNearest(r.point(0,0), {'index':'g', 'max_dist':10000000}).pluck('dist', {'doc':'id'})", "err('ReqlQueryLogicError', 'The distance has become too large for continuing the indexed nearest traversal.  Consider specifying a smaller `max_dist` parameter.  (Radius must be smaller than a quarter of the circumference along the minor axis of the reference ellipsoid.  Got 10968937.995244588703m, but must be smaller than 9985163.1855612862855m.)', [0])", 'line 190', {}, {})
test("tbl.getNearest(r.point(0,0), {'index':'g', 'max_dist':1566, 'unit':'km'}).pluck('dist', {'doc':'id'})", "([{'dist':0,'doc':{'id':1}},{'dist':0.00005565974539675422,'doc':{'id':2}},{'dist':1565.1090992178897,'doc':{'id':0}}])", 'line 194', {}, {})
test("tbl.getNearest(r.point(0,0), {'index':'g'}).typeOf()", '("ARRAY")', 'line 201', {}, {})
test("tbl.getNearest(r.point(0,0), {'index':'g'}).map(r.row).typeOf()", '("ARRAY")', 'line 205', {}, {})


the_end()
