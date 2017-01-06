#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('./common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_transformation_js7_2', 'test')
setup_table('tbl2', 'polyglot_transformation_js7_2_tbl1', 'test')
setup_table('tbl3', 'polyglot_transformation_js7_2_tbl2', 'test')
setup_table_check()

test("tbl.insert(function(){\nvar res = []\nfor (var i = 0; i < 100; i++) {\nres.push({id:i, 'a':i%4});\n}\nreturn res;\n}())", "({'deleted':0.0,'replaced':0.0,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':100})", 'line 8', {}, {})
test("tbl.indexCreate('a')", "({'created':1})", 'line 18', {}, {})
test("tbl.indexWait().pluck('index', 'ready')", "", 'line 27', {}, {})
test("tbl2.insert(function(){\nvar res = []\nfor (var i = 0; i < 100; i++) {\nres.push({id:i, 'b':i%4});\n}\nreturn res;\n}())", "({'deleted':0.0,'replaced':0.0,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':100})", 'line 31', {}, {})
test("tbl3.insert(function(){\nvar res = []\nfor (var i = 0; i < 100; i++) {\nres.push({id:i, 'a':i%4, 'b':{'c':i%5}});\n}\nreturn res;\n}())", "({'deleted':0.0,'replaced':0.0,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':100})", 'line 43', {}, {})
test("tbl.map(function(row) { return row('id'); }).reduce(function(a,b) { return a.add(b); })", '4950', 'line 58', {}, {})
test("tbl.map(r.row('id')).reduce(function(a,b) { return a.add(b); })", '4950', 'line 59', {}, {})
test("tbl.union(tbl).map(function(row) { return row('id'); }).reduce(function(a,b) { return a.add(b); })", '9900', 'line 68', {}, {})
test("tbl.union(tbl).map(r.row('id')).reduce(function(a,b) { return a.add(b); })", '9900', 'line 69', {}, {})
test('tbl.coerceTo("array").union(tbl).map(function(row) { return row(\'id\'); }).reduce(function(a,b) { return a.add(b); })', '9900', 'line 78', {}, {})
test('tbl.coerceTo("array").union(tbl).map(r.row(\'id\')).reduce(function(a,b) { return a.add(b); })', '9900', 'line 79', {}, {})
test('tbl.union(tbl.coerceTo("array")).map(function(row) { return row(\'id\'); }).reduce(function(a,b) { return a.add(b); })', '9900', 'line 88', {}, {})
test('tbl.union(tbl.coerceTo("array")).map(r.row(\'id\')).reduce(function(a,b) { return a.add(b); })', '9900', 'line 89', {}, {})
test('r.expr(["a"]).fold(null, function() {return null;}, {emit: function() {return [0]}, finalEmit: function() {return [1, 2, 3]} })', '[0, 1, 2, 3]', 'line 107', {}, {})
test('tbl.concatMap(function(row) { return []; })', '[]', 'line 112', {}, {})
define("tbl.concatMap(function(row) { return [row('a'), row('a').add(1).mod(4)]; })", 'ccm')
test('ccm.count()', '200', 'line 119', {}, {})
test('ccm.reduce(function(a,b) { return a.add(b).mod(4); })', '0', 'line 122', {}, {})
test("tbl.orderBy('id').nth(0)", "({'id':0, 'a':0})", 'line 128', {}, {})
test('tbl.orderBy([1,2,3])', "err('ReqlQueryLogicError', 'Expected type STRING but found ARRAY.', [0])", 'line 133', {}, {})
test("tbl.orderBy({index:'id'}).nth(0)", "({'id':0, 'a':0})", 'line 138', {}, {})
test("tbl.orderBy({index:'id'}).nth(0).update({a:0})('unchanged')", '1', 'line 143', {}, {})
test("tbl.getAll(0).update({a:0})('unchanged')", '1', 'line 148', {}, {})
test("tbl.orderBy({index:'id'}).orderBy({index:'id'}).nth(0)", "err('ReqlQueryLogicError', 'Cannot perform multiple indexed ORDER_BYs on the same table.', [0])", 'line 153', {}, {})
test("tbl.orderBy({index:'id'}).orderBy({index:'id'}).nth(0)", "err('ReqlQueryLogicError', 'Cannot perform multiple indexed ORDER_BYs on the same table.', [0])", 'line 159', {}, {})
test("tbl.orderBy('id').orderBy({index:'id'}).nth(0)", "err('ReqlQueryLogicError', 'Indexed order_by can only be performed on a TABLE or TABLE_SLICE.', [0])", 'line 164', {}, {})
test("tbl.orderBy('id').orderBy({index:'a'}).nth(0)", "err('ReqlQueryLogicError', 'Indexed order_by can only be performed on a TABLE or TABLE_SLICE.', [0])", 'line 169', {}, {})
test("tbl.between(5, r.maxval, {index:'id'}).orderBy({index:'id'}).nth(0)", "({'id':5, 'a':1})", 'line 174', {}, {})
test("tbl.orderBy('a', {index:'id'}).between(5, r.maxval, {index:'id'}).nth(0)", "err('ReqlQueryLogicError', 'Expected type TABLE_SLICE but found SELECTION:', [0])", 'line 179', {}, {})
test("tbl.orderBy(function (x) { return x('id'); }).nth(0)", "({'id':0, 'a':0})", 'line 184', {}, {})
test("tbl.orderBy('a', 'id').nth(0)", "({'id':0,'a':0})", 'line 188', {}, {})
test("tbl.orderBy('id', {index:'a'}).nth(0)", "({'id':0,'a':0})", 'line 192', {}, {})
test("tbl.orderBy(function (x) { return [x('a'), x('id')]; }).nth(0)", "({'id':0, 'a':0})", 'line 203', {}, {})
test("tbl.orderBy(r.desc('a'), r.asc('id')).nth(0)", "({'id':3,'a':3})", 'line 207', {}, {})
test("tbl.orderBy('id', {index:r.desc('a')}).nth(0)", "({'id':3,'a':3})", 'line 211', {}, {})
test("tbl.orderBy(r.desc(function (x) { return x('a'); }), function (x) { return x('id'); }).nth(0)", "({'id':3, 'a':3})", 'line 216', {}, {})
test("tbl.orderBy(r.asc('a'), r.desc('id')).nth(0)", "({'id':96,'a':0})", 'line 220', {}, {})
test("tbl.orderBy(r.desc('id'), {index:'a'}).nth(0)", "({'id':96,'a':0})", 'line 224', {}, {})
test("tbl.orderBy('id').typeOf()", "'SELECTION<ARRAY>'", 'line 228', {}, {})
test("tbl.orderBy('missing').orderBy('id').nth(0)", "({'id':0, 'a':0})", 'line 231', {}, {})
test("tbl.orderBy('missing').orderBy({index:'id'}).nth(0)", "err('ReqlQueryLogicError', 'Indexed order_by can only be performed on a TABLE or TABLE_SLICE.', [0])", 'line 235', {}, {})
test("tbl.orderBy('id', 'missing').nth(0)", "({'id':0, 'a':0})", 'line 239', {}, {})
test("tbl.orderBy('missing', {index:'id'}).nth(0)", "({'id':0, 'a':0})", 'line 243', {}, {})
test('tbl.orderBy(r.desc(\'id\')).coerceTo("ARRAY").eq(tbl.orderBy(function (x) { return r.expr(0).sub(x(\'id\')); }).coerceTo("ARRAY"))', 'true', 'line 249', {}, {})
test('tbl.orderBy({index:r.desc(\'id\')}).coerceTo("ARRAY").eq(tbl.orderBy(function (x) { return r.expr(0).sub(x(\'id\')); }).coerceTo("ARRAY"))', 'true', 'line 254', {}, {})
test('tbl.orderBy({index:r.desc(\'id\')}).coerceTo("ARRAY").eq(tbl.orderBy(r.desc(\'id\')).coerceTo("ARRAY"))', 'true', 'line 259', {}, {})
test('tbl.skip(1).count()', '99', 'line 263', {}, {})
test('tbl.skip(-1).count()', "err('ReqlQueryLogicError', 'Cannot use a negative left index on a stream.', [0])", 'line 265', {}, {})
test("tbl.skip('foo').count()", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [0])", 'line 267', {}, {})
test('tbl.limit(1).count()', '1', 'line 271', {}, {})
test('tbl.limit(-1).count()', "err('ReqlQueryLogicError', 'LIMIT takes a non-negative argument (got -1)', [0])", 'line 273', {}, {})
test("tbl.limit('foo').count()", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [0])", 'line 275', {}, {})
test('tbl.slice(1, 3).count()', '2', 'line 279', {}, {})
test('tbl.slice(5).count()', '95', 'line 281', {}, {})
test('tbl.slice(-1, -3).count()', "err('ReqlQueryLogicError', 'Cannot use a negative left index on a stream.', [0])", 'line 283', {}, {})
test('tbl.slice(0, -3).count()', "err('ReqlQueryLogicError', 'Cannot use a right index < -1 on a stream.', [0])", 'line 285', {}, {})
test('tbl.slice(0, -1).count()', "err('ReqlQueryLogicError', 'Cannot slice to an open right index of -1 on a stream.', [])", 'line 287', {}, {})
test("tbl.slice('foo', 'bar').count()", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [0])", 'line 289', {}, {})
test('tbl.slice(1, null).count()', "err('ReqlNonExistenceError', 'Expected type NUMBER but found NULL.', [0])", 'line 291', {}, {})
test('tbl.slice(null, 1).count()', "err('ReqlNonExistenceError', 'Expected type NUMBER but found NULL.', [0])", 'line 293', {}, {})
test('tbl.slice(12, 20).count()', '8', 'line 296', {}, {})
test("tbl.slice(12, 20, {rightBound:'closed'}).count()", '9', 'line 300', {}, {})
test("tbl.slice(12, 20, {leftBound:'open'}).count()", '7', 'line 304', {}, {})
test("tbl.slice(12, 20, {leftBound:'open', rightBound:'closed'}).count()", '8', 'line 308', {}, {})
test('tbl.slice(12, -1).count()', 'err("ReqlQueryLogicError", "Cannot slice to an open right index of -1 on a stream.", [])', 'line 311', {}, {})
test("tbl.slice(12, -1, {rightBound:'closed'}).count()", '88', 'line 315', {}, {})
test('tbl.slice(12, -2).count()', 'err("ReqlQueryLogicError", "Cannot use a right index < -1 on a stream.", [])', 'line 318', {}, {})
test("tbl.slice(12, -2, {rightBound:'closed'}).count()", 'err("ReqlQueryLogicError", "Cannot use a right index < -1 on a stream.", [])', 'line 322', {}, {})
test('tbl.slice(-12, -2).count()', 'err("ReqlQueryLogicError", "Cannot use a negative left index on a stream.", [])', 'line 325', {}, {})
test("tbl.slice(-12, -2, {rightBound:'closed'}).count()", 'err("ReqlQueryLogicError", "Cannot use a negative left index on a stream.", [])', 'line 329', {}, {})
test("tbl.coerceTo('array').slice(12, 20).count()", '8', 'line 332', {}, {})
test("tbl.coerceTo('array').slice(12, 20, {rightBound:'closed'}).count()", '9', 'line 336', {}, {})
test("tbl.coerceTo('array').slice(12, 20, {leftBound:'open'}).count()", '7', 'line 340', {}, {})
test("tbl.coerceTo('array').slice(12, 20, {leftBound:'open', rightBound:'closed'}).count()", '8', 'line 344', {}, {})
test("tbl.coerceTo('array').slice(12, -1).count()", '87', 'line 347', {}, {})
test("tbl.coerceTo('array').slice(12, -1, {rightBound:'closed'}).count()", '88', 'line 351', {}, {})
test("tbl.coerceTo('array').slice(12, -2).count()", '86', 'line 354', {}, {})
test("tbl.coerceTo('array').slice(12, -2, {rightBound:'closed'}).count()", '87', 'line 358', {}, {})
test("tbl.coerceTo('array').slice(-12, -2).count()", '10', 'line 361', {}, {})
test("tbl.coerceTo('array').slice(-12, -2, {rightBound:'closed'}).count()", '11', 'line 365', {}, {})
define('r.expr([1,2,3,4,5])', 'arr')
test("tbl.orderBy('id').nth(1)", "({'id':1,'a':1})", 'line 387', {}, {})
test("tbl.orderBy('id').nth(-1)", "({'id':99,'a':3})", 'line 389', {}, {})
test("tbl.orderBy('id').nth('foo').count()", "err('ReqlQueryLogicError', 'Expected type NUMBER but found STRING.', [0])", 'line 391', {}, {})
test('tbl.isEmpty()', 'false', 'line 395', {}, {})
test('tbl.limit(0).isEmpty()', 'true', 'line 397', {}, {})
test('r.expr(1).isEmpty()', "err('ReqlQueryLogicError', 'Cannot convert NUMBER to SEQUENCE', [])", 'line 399', {}, {})
test('r.expr("").isEmpty()', "err('ReqlQueryLogicError', 'Cannot convert STRING to SEQUENCE', [])", 'line 401', {}, {})
test('tbl3.pluck().nth(0)', '({})', 'line 405', {}, {})
test('tbl3.pluck({}).nth(0)', '({})', 'line 408', {}, {})
test('tbl3.pluck([]).nth(0)', '({})', 'line 411', {}, {})
test("tbl3.pluck('id').orderBy('id').nth(0)", "({'id':0})", 'line 414', {}, {})
test("tbl3.pluck(['id']).orderBy('id').nth(0)", "({'id':0})", 'line 417', {}, {})
test("tbl3.pluck({'id':true}).orderBy('id').nth(0)", "({'id':0})", 'line 421', {}, {})
test("tbl3.pluck('id', 'a').orderBy('id').nth(0)", "({'id':0,'a':0})", 'line 425', {}, {})
test("tbl3.pluck(['id', 'a']).orderBy('id').nth(0)", "({'id':0,'a':0})", 'line 428', {}, {})
test("tbl3.pluck({'id':true, 'a':true}).orderBy('id').nth(0)", "({'id':0,'a':0})", 'line 432', {}, {})
test("tbl3.pluck('id', 'missing').orderBy('id').nth(0)", "({'id':0})", 'line 436', {}, {})
test("tbl3.pluck(['id', 'missing']).orderBy('id').nth(0)", "({'id':0})", 'line 439', {}, {})
test("tbl3.pluck({'id':true, 'missing':true}).orderBy('id').nth(0)", "({'id':0})", 'line 443', {}, {})
test("tbl3.pluck('id', {'b':'c'}).orderBy('id').nth(0)", "({'id':0, 'b':{'c':0}})", 'line 447', {}, {})
test("tbl3.pluck(['id', {'b':'c'}]).orderBy('id').nth(0)", "({'id':0, 'b':{'c':0}})", 'line 450', {}, {})
test('tbl3.pluck(1)', "err('ReqlQueryLogicError', 'Invalid path argument `1`.', [])", 'line 453', {}, {})
test('r.expr([[{"foo":1}]]).pluck("foo")', "err('ReqlQueryLogicError', 'Cannot perform pluck on a sequence of sequences.', [])", 'line 457', {}, {})
test("r.expr(['a','b']).map(function (x) { return r.expr({'a':1,'b':2}).pluck(x); })", "[{'a':1},{'b':2}]", 'line 462', {}, {})
test("tbl.without().orderBy('id').nth(0)", "({'id':0,'a':0})", 'line 470', {}, {})
test("tbl.without('a').orderBy('id').nth(0)", "({'id':0})", 'line 473', {}, {})
test("tbl.without('id', 'a').nth(0)", '({})', 'line 476', {}, {})
test("tbl.without('a', 'missing').orderBy('id').nth(0)", "({'id':0})", 'line 479', {}, {})
test("tbl3.without('a', {'b':'c'}).orderBy('id').nth(0)", "({'id':0, 'b':{}})", 'line 482', {}, {})
test("tbl3.without(['a', {'b':'c'}]).orderBy('id').nth(0)", "({'id':0, 'b':{}})", 'line 485', {}, {})
test("tbl3.without(['a', {'b':'d'}]).orderBy('id').nth(0)", "({'id':0, 'b':{'c':0}})", 'line 488', {}, {})
test('tbl.union(tbl2).count()', '200', 'line 492', {}, {})
test('tbl.union([1,2,3]).count()', '103', 'line 494', {}, {})
test('r.expr([1,2,3]).union(tbl2).count()', '103', 'line 496', {}, {})
define("tbl.orderBy('id')", 'ord')
test("ord.offsetsOf(r.row('id').lt(2))", '[0,1]', 'line 501', {}, {})
test('r.expr([1,2,3,4]).offsetsOf(3)', '[2]', 'line 506', {}, {})
test('r.expr([1]).offsetsOf(tbl)', "err('ReqlQueryLogicError', 'Expected type DATUM but found TABLE:', [])", 'line 509', {}, {})
test('r.expr(1).do(function(x){ return r.expr([2,1,0]).offsetsOf(x); })', '[1]', 'line 513', {}, {})
test('tbl.contains(tbl.nth(0))', 'true', 'line 519', {}, {})
test("tbl.contains(tbl.nth(0).pluck('id'))", 'false', 'line 522', {}, {})
test("tbl3.filter({'b':{'c':0}}).pluck('id').orderBy('id').nth(0)", "({'id':0})", 'line 533', {}, {})
test("tbl3.filter({'b':{'c':6}})", '[]', 'line 536', {}, {})
test("tbl3.filter(r.literal({'id':0}))", '[]', 'line 539', {}, {})
test("tbl3.filter({'b':r.literal({'c':0})}).pluck('id').orderBy('id').nth(0)", "({'id':0})", 'line 542', {}, {})

the_end()