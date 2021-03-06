#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('./common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_selection_js7_2', 'test')
setup_table('tbl2', 'polyglot_selection_js7_2_tbl1', 'test')
setup_table('tbl3', 'polyglot_selection_js7_2_tbl2', 'test')
setup_table_check()

test("tbl.insert(function(){\nvar res = []\nfor (var i = 0; i < 100; i++) {\nres.push({id:i, 'a':i%4});\n}\nreturn res;\n}())", "({'deleted':0.0,'replaced':0.0,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':100})", 'line 8', {}, {})
test("tbl2.insert(function(){\nvar res = []\nfor (var i = 0; i < 100; i++) {\nres.push({id:i, 'b':i%4});\n}\nreturn res;\n}())", "({'deleted':0.0,'replaced':0.0,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':100})", 'line 20', {}, {})
test('tbl.typeOf()', "'TABLE'", 'line 31', {}, {})
test("r.db('missing').table('bar')", 'err("ReqlOpFailedError", \'Database `missing` does not exist.\', [0])', 'line 35', {}, {})
test("r.db('test').table('missing')", 'err("ReqlOpFailedError", \'Table `test.missing` does not exist.\', [0])', 'line 39', {}, {})
test('tbl.insert({"id":"\\x00"}).pluck("errors","inserted")', '({"errors":1,"inserted":0})', 'line 43', {}, {})
test('tbl.insert({"id":["embedded",["null\\x00"]]}).pluck("errors","inserted")', '({"errors":1,"inserted":0})', 'line 46', {}, {})
test("tbl3.insert({'id':'\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439','value':'\u0417\u0435\u043c\u043b\u044f!'})", "({'deleted':0.0,'replaced':0.0,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':1})", 'line 50', {}, {})
test("tbl3.get('\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439')", "({'id':'\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439','value':'\u0417\u0435\u043c\u043b\u044f!'})", 'line 60', {}, {})
test("tbl3.filter({'value':'\u0417\u0435\u043c\u043b\u044f!'})", "[{'id':'\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439','value':'\u0417\u0435\u043c\u043b\u044f!'}]", 'line 73', {}, {})
test("r.db('%')", 'err("ReqlQueryLogicError", \'Database name `%` invalid (Use A-Za-z0-9_ only).\', [0])', 'line 86', {}, {})
test("r.db('test').table('%')", 'err("ReqlQueryLogicError", \'Table name `%` invalid (Use A-Za-z0-9_ only).\', [0])', 'line 89', {}, {})
test('tbl.count()', '100', 'line 93', {}, {})
define("tbl2.info().getField('name')", 'tbl2Name')
define("tbl2.info().getField('db').getField('name')", 'tbl2DbName')
test("r.db(tbl2DbName).table(tbl2Name, {readMode:'outdated'}).count()", '100', 'line 105', {}, {})
test("r.db(tbl2DbName).table(tbl2Name, {readMode:'single'}).count()", '100', 'line 106', {}, {})
test("r.db(tbl2DbName).table(tbl2Name, {readMode:'majority'}).count()", '100', 'line 107', {}, {})
test('r.db(tbl2DbName).table(tbl2Name, {readMode:null}).count()', 'err("ReqlNonExistenceError", \'Expected type STRING but found NULL.\')', 'line 116', {}, {})
test('r.db(tbl2DbName).table(tbl2Name, {readMode:false}).count()', 'err("ReqlQueryLogicError", \'Expected type STRING but found BOOL.\')', 'line 121', {}, {})
test("r.db(tbl2DbName).table(tbl2Name, {readMode:'fake'}).count()", 'err("ReqlQueryLogicError", \'Read mode `fake` unrecognized (options are "majority", "single", and "outdated").\')', 'line 126', {}, {})
test('tbl.get(20).count()', '2', 'line 130', {}, {})
test('tbl.get(20)', "({'id':20,'a':0})", 'line 134', {}, {})
test('tbl.get(2000)', 'null', 'line 138', {}, {})
test('tbl.get()', 'err("ReqlCompileError", \'Expected 2 arguments but found 1.\', [1])', 'line 142', {}, {})
test('tbl.get(10, 20)', 'err("ReqlCompileError", \'Expected 2 arguments but found 3.\', [1])', 'line 145', {}, {})
define("r.db('test').table('testpkey')", 'tblpkey')
test("r.db('test').tableCreate('testpkey', {primaryKey:'foo'})", "partial({'tables_created':1})", 'line 150', {}, {})
test("tblpkey.insert({'foo':10,'a':10})", "({'deleted':0.0,'replaced':0.0,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':1})", 'line 155', {}, {})
test('tblpkey.get(10)', "({'foo':10,'a':10})", 'line 159', {}, {})
test('tbl.getAll()', '[]', 'line 163', {}, {})
test('tbl.getAll(20)', '[{"id":20,"a":0}]', 'line 165', {}, {})
test('tbl.getAll().typeOf()', '"SELECTION<STREAM>"', 'line 167', {}, {})
test('tbl.getAll(20).typeOf()', '"SELECTION<STREAM>"', 'line 169', {}, {})
test('tbl.between(2, 1).typeOf()', "'TABLE_SLICE'", 'line 173', {}, {})
test('tbl.between(1, 2).typeOf()', "'TABLE_SLICE'", 'line 175', {}, {})
test("tbl.between(1, 2, {'index':'id'}).typeOf()", "'TABLE_SLICE'", 'line 178', {}, {})
test("tbl.between(1, 1, {'right_bound':'closed'}).typeOf()", "'TABLE_SLICE'", 'line 182', {}, {})
test('tbl.between(2, 1).typeOf()', "'TABLE_SLICE'", 'line 185', {}, {})
test("tbl.between(2, 1, {'index':'id'}).typeOf()", "'TABLE_SLICE'", 'line 188', {}, {})
test('tbl.between(21, 20).count()', '0', 'line 192', {}, {})
test('tbl.between(20, 29).count()', '9', 'line 194', {}, {})
test('tbl.between(-10, 9).count()', '9', 'line 196', {}, {})
test('tbl.between(80, 2000).count()', '20', 'line 198', {}, {})
test('tbl.between(-2000, 2000).count()', '100', 'line 200', {}, {})
test("tbl.between(20, 29, {'right_bound':'closed'}).count()", '10', 'line 206', {}, {})
test("tbl.between(-10, 9, {'right_bound':'closed'}).count()", '10', 'line 210', {}, {})
test("tbl.between(80, 2000, {'right_bound':'closed'}).count()", '20', 'line 214', {}, {})
test("tbl.between(-2000, 2000, {'right_bound':'closed'}).count()", '100', 'line 218', {}, {})
test("tbl.between(20, 29, {'left_bound':'open'}).count()", '8', 'line 224', {}, {})
test("tbl.between(-10, 9, {'left_bound':'open'}).count()", '9', 'line 228', {}, {})
test("tbl.between(80, 2000, {'left_bound':'open'}).count()", '19', 'line 232', {}, {})
test("tbl.between(-2000, 2000, {'left_bound':'open'}).count()", '100', 'line 236', {}, {})
test('r.expr([1, 2, 3]).between(-1, 2)', "err('ReqlQueryLogicError', 'Expected type TABLE_SLICE but found DATUM:', [0])", 'line 240', {}, {})
test('tbl.between(r.minval, 2).count()', '2', 'line 244', {}, {})
test("tbl.between(r.minval, 2, {'right_bound':'closed'}).count()", '3', 'line 248', {}, {})
test("tbl.between(r.minval, 2, {'left_bound':'open'}).count()", '2', 'line 252', {}, {})
test('tbl.between(2, r.maxval).count()', '98', 'line 255', {}, {})
test('tbl.between(2).count()', "err('ReqlCompileError', 'Expected 2 arguments (not including options) but found 1.', '[]')", 'line 258', {}, {})
test('tbl.between(null, 2).count()', "err('ReqlQueryLogicError', 'Cannot use `nu' + 'll` in BETWEEN, use `r.minval` or `r.maxval` to denote unboundedness.')", 'line 265', {}, {})
test('tbl.between(2, null).count()', "err('ReqlQueryLogicError', 'Cannot use `nu' + 'll` in BETWEEN, use `r.minval` or `r.maxval` to denote unboundedness.')", 'line 266', {}, {})
test('tbl.between(null, null).count()', "err('ReqlQueryLogicError', 'Cannot use `nu' + 'll` in BETWEEN, use `r.minval` or `r.maxval` to denote unboundedness.')", 'line 267', {}, {})
test('tblpkey.between(9, 11).count()', '1', 'line 271', {}, {})
test('tblpkey.between(11, 12).count()', '0', 'line 274', {}, {})
test("tbl.filter(function(row) { return row('a').gt(2); }).count()", '25', 'line 279', {}, {})
test('tbl.filter(function(row) { return 1; }).count()', '100', 'line 285', {}, {})
test('r.expr([1, 2, 3, 4, 5]).filter(r.row.gt(2)).filter(r.row.gt(3))', '[4, 5]', 'line 291', {}, {})
define('r.expr([[1, 2], [3, 4], [5, 6]])', 'nested')
test('nested.filter(function (x) { return x.filter(function (y) { return y.ge(4); }).count().gt(0) })', '[[3, 4], [5, 6]]', 'line 299', {}, {})
test('nested.filter(r.row.filter(function(y) { return y.ge(4) }).count().gt(0))', '([[3, 4], [5, 6]])', 'line 304', {}, {})
test('nested.filter(function (x) { return x.filter(r.row.ge(4)).count().gt(0) })', 'err("ReqlCompileError", \'Cannot use r.row in nested queries.  Use functions instead.\', [0])', 'line 308', {}, {})
test('nested.filter(r.row.filter(r.row.ge(4)).count().gt(0))', 'err("ReqlCompileError", \'Cannot use r.row in nested queries.  Use functions instead.\', [0])', 'line 312', {}, {})
test("r.expr([{'a':1,'b':1,'c':3},{'a':1,'b':2,'c':3}]).filter({'a':1,'b':2})", "[{'a':1,'b':2,'c':3}]", 'line 316', {}, {})
test("r.expr([{'a':1,'b':1,'c':3},{'a':1,'b':2,'c':3}]).filter({'a':1})", "[{'a':1,'b':1,'c':3},{'a':1,'b':2,'c':3}]", 'line 319', {}, {})
test("r.expr([{'a':1,'b':1,'c':3},{'a':1,'b':2,'c':3}]).filter({'a':r.row('b')})", "[{'a':1,'b':1,'c':3}]", 'line 324', {}, {})
test("r.expr([{'a':1}]).filter({'b':1})", '[]', 'line 329', {}, {})
test("tbl.count(function(){ return {'a':1}; })", '25', 'line 333', {}, {})
test("tbl.count({'a':1})", '0', 'line 338', {}, {})
test('r.expr([1,2,3,1]).count(1)', '2', 'line 341', {}, {})
test("r.expr([null, 4, null, 'foo']).count(null)", '2', 'line 344', {}, {})
test('r.expr(5).add(tbl)', "err('ReqlQueryLogicError', 'Expected type DATUM but found TABLE:', [0])", 'line 349', {}, {})
test("tbl.hasFields('field').typeOf()", '"SELECTION<STREAM>"', 'line 353', {}, {})

the_end()
