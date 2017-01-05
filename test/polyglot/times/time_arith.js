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

define('1375147296.681', 'rt1')
define('1375147296.682', 'rt2')
define('1375147297.681', 'rt3')
define('2375147296.681', 'rt4')
define('[rt1, rt2, rt3, rt4]', 'rts')
define('r.epochTime(rt1)', 't1')
define('r.epochTime(rt2)', 't2')
define('r.epochTime(rt3)', 't3')
define('r.epochTime(rt4)', 't4')
define('r.expr([t1, t2, t3, t4])', 'ts')
test('t2.sub(t1).mul(1000).do(r.row.gt(0.99).and(r.row.lt(1.01)))', 'true', 'line 18', {}, {})
test('t3.sub(t1)', '1', 'line 21', {}, {})
test('t4.sub(t1)', '1000000000', 'line 24', {}, {})
test('t1.sub(t2).mul(1000).do(r.row.lt(-0.99).and(r.row.gt(-1.01)))', 'true', 'line 29', {}, {})
test('t1.sub(t3)', '-1', 'line 32', {}, {})
test('t1.sub(t4)', '-1000000000', 'line 35', {}, {})
test('ts.map(t1.add(r.row.sub(t1))).map(r.row.toEpochTime())', '([rt1, rt2, rt3, rt4])', 'line 40', {}, {})
test('ts.map(t1.add(r.row).sub(t1)).map(r.row.toEpochTime())', 'err("ReqlQueryLogicError", "Expected type NUMBER but found PTYPE<TIME>.", [])', 'line 44', {}, {})
test('ts.map(t1.sub(t1.sub(r.row))).map(r.row.toEpochTime())', '([rt1, rt2, rt3, rt4])', 'line 48', {}, {})
test('ts.map(function(x) { return ts.map(function(y) { return [x.lt(y), x.le(y), x.eq(y), x.ne(y), x.ge(y), x.gt(y)]; }); })', '([[[false, true,  true,  false, true,  false],\n[true,  true,  false, true,  false, false],\n[true,  true,  false, true,  false, false],\n[true,  true,  false, true,  false, false]],\n[[false, false, false, true,  true,  true],\n[false, true,  true,  false, true,  false],\n[true,  true,  false, true,  false, false],\n[true,  true,  false, true,  false, false]],\n[[false, false, false, true,  true,  true],\n[false, false, false, true,  true,  true],\n[false, true,  true,  false, true,  false],\n[true,  true,  false, true,  false, false]],\n[[false, false, false, true,  true,  true],\n[false, false, false, true,  true,  true],\n[false, false, false, true,  true,  true],\n[false, true,  true,  false, true,  false]]])', 'line 53', {}, {})
define('r([null, true, false, 1, "1", [1], {"1":1}, r.binary(Buffer(0))])', 'datumTypes')
test('datumTypes.map(function(x) { return r([[x, t1], [t1, x]]).map(function(xy) { return xy.nth(0).do(function(x) { return xy.nth(1).do(function(y) { return [x.lt(y), x.le(y), x.eq(y), x.ne(y), x.ge(y), x.gt(y)]; }); }); }); })', '([[[true,  true,  false, true,  false, false],\n[false, false, false, true,  true,  true]],\n[[true,  true,  false, true,  false, false],\n[false, false, false, true,  true,  true]],\n[[true,  true,  false, true,  false, false],\n[false, false, false, true,  true,  true]],\n[[true,  true,  false, true,  false, false],\n[false, false, false, true,  true,  true]],\n[[false, false, false, true,  true,  true],\n[true,  true,  false, true,  false, false]],\n[[true,  true,  false, true,  false, false],\n[false, false, false, true,  true,  true]],\n[[true,  true,  false, true,  false, false],\n[false, false, false, true,  true,  true]],\n[[true,  true,  false, true,  false, false],\n[false, false, false, true,  true,  true]]])', 'line 80', {}, {})
test('ts.map(function(a) { return ts.map(function(b) { return ts.map(function(c) { return b.during(a, c); }); }); })', '([[[false, true,  true,  true],\n[false, false, true,  true],\n[false, false, false, true],\n[false, false, false, false]],\n[[false, false, false, false],\n[false, false, true,  true],\n[false, false, false, true],\n[false, false, false, false]],\n[[false, false, false, false],\n[false, false, false, false],\n[false, false, false, true],\n[false, false, false, false]],\n[[false, false, false, false],\n[false, false, false, false],\n[false, false, false, false],\n[false, false, false, false]]])', 'line 100', {}, {})
test("ts.map(function(a) { return ts.map(function(b) { return ts.map(function(c) { return b.during(a, c, {leftBound:'open'}); }); }); })", '([[[false, false, false, false],\n[false, false, true,  true],\n[false, false, false, true],\n[false, false, false, false]],\n[[false, false, false, false],\n[false, false, false, false],\n[false, false, false, true],\n[false, false, false, false]],\n[[false, false, false, false],\n[false, false, false, false],\n[false, false, false, false],\n[false, false, false, false]],\n[[false, false, false, false],\n[false, false, false, false],\n[false, false, false, false],\n[false, false, false, false]]])', 'line 120', {}, {})
test("ts.map(function(a) { return ts.map(function(b) { return ts.map(function(c) { return b.during(a, c, {rightBound:'closed'}); }); }); })", '([[[true,  true,  true,  true],\n[false, true,  true,  true],\n[false, false, true,  true],\n[false, false, false, true]],\n[[false, false, false, false],\n[false, true,  true,  true],\n[false, false, true,  true],\n[false, false, false, true]],\n[[false, false, false, false],\n[false, false, false, false],\n[false, false, true,  true],\n[false, false, false, true]],\n[[false, false, false, false],\n[false, false, false, false],\n[false, false, false, false],\n[false, false, false, true]]])', 'line 140', {}, {})
test("ts.map(function(a) { return ts.map(function(b) { return ts.map(function(c) { return b.during(a, c, {leftBound:'open', rightBound:'closed'}); }); }); })", '([[[false, false, false, false],\n[false, true,  true,  true],\n[false, false, true,  true],\n[false, false, false, true]],\n[[false, false, false, false],\n[false, false, false, false],\n[false, false, true,  true],\n[false, false, false, true]],\n[[false, false, false, false],\n[false, false, false, false],\n[false, false, false, false],\n[false, false, false, true]],\n[[false, false, false, false],\n[false, false, false, false],\n[false, false, false, false],\n[false, false, false, false]]])', 'line 160', {}, {})
test('ts.map(r.row.date().add(r.row.timeOfDay())).map(r.row.toEpochTime())', 'rts', 'line 180', {}, {})
test('r.epochTime(rt1).do(r.js("(function(data){return data})")).toEpochTime()', 'rt1', 'line 186', {}, {})
test('r.do(r.js("new Date(\'2012-08-01\')")).toISO8601()', '("2012-08-01T00:00:00+00:00")', 'line 191', {}, {})
test('r.do(r.js("(function(x){doc = new Object(); doc.date = new Date(\'2012-08-01\'); return doc;})"))("date").toISO8601()', '("2012-08-01T00:00:00+00:00")', 'line 196', {}, {})

the_end()
