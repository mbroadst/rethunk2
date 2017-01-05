#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_changefeeds_edge_js7_2', 'test')
setup_table_check()

define('r.expr([0,1,2,3,4,5,6,7,8])', 'commonPrefix')
test("tbl.indexCreate('sindex', function (row) { return commonPrefix.append(row('value')); })", "({'created':1})", 'line 7', {}, {})
test("tbl.indexWait('sindex')", "", 'line 11', {}, {})
test("r.range(7).coerceTo('array').add(r.range(10,70).coerceTo('array')).append(100).map(r.row.coerceTo('string'))", "", 'line 14', {}, {'variable': 'pre'})
test("r.range(2,9).coerceTo('array').add(r.range(20,90).coerceTo('array')).map(r.row.coerceTo('string'))", "", 'line 16', {}, {'variable': 'mid'})
test("r.range(3,10).coerceTo('array').add(r.range(30,100).coerceTo('array')).map(r.row.coerceTo('string'))", "", 'line 18', {}, {'variable': 'post'})
test("r.range(2).coerceTo('array').add(r.range(10, 20).coerceTo('array')).append(100).map(r.row.coerceTo('string'))", "", 'line 21', {}, {'variable': 'erroredres'})
test("tbl.between(r.minval, commonPrefix.append('7'), {index:'sindex'}).changes({squash:false}).limit(pre.length)('new_val')('value')", "", 'line 25', {}, {'variable': 'preChanges'})
test("tbl.between(commonPrefix.append('2'), commonPrefix.append('9'), {index:'sindex'}).changes({squash:false}).limit(post.length)('new_val')('value')", "", 'line 28', {}, {'variable': 'midChanges'})
test("tbl.between(commonPrefix.append('3'), r.maxval, {index:'sindex'}).changes({squash:false}).limit(mid.length)('new_val')('value')", "", 'line 31', {}, {'variable': 'postChanges'})
test('tbl.map(r.branch(r.row(\'value\').lt(\'2\'), r.row, r.row("dummy"))).changes({squash:false}).limit(erroredres.length)(\'new_val\')(\'value\')', "", 'line 37', {}, {'variable': 'premap_changes1'})
test('tbl.changes({squash:false}).map(r.branch(r.row(\'new_val\')(\'value\').lt(\'2\'), r.row, r.row("dummy"))).limit(erroredres.length)(\'new_val\')(\'value\')', "", 'line 41', {}, {'variable': 'postmap_changes1'})
test('tbl.filter(r.branch(r.row(\'value\').lt(\'2\'), true, r.row("dummy"))).changes({squash:false}).limit(erroredres.length)(\'new_val\')(\'value\')', "", 'line 45', {}, {'variable': 'prefilter_changes1'})
test('tbl.changes({squash:false}).filter(r.branch(r.row(\'new\'+\'_\'+\'val\')(\'value\').lt(\'2\'), true, r.row("dummy"))).limit(erroredres.length)(\'new_val\')(\'value\')', "", 'line 49', {}, {'variable': 'postfilter_changes1'})
test("tbl.map(r.branch(r.row('value').lt('2'), r.row, r.expr([]).nth(1))).changes({squash:false}).limit(erroredres.length)('new_val')('value')", "", 'line 55', {}, {'variable': 'premap_changes2'})
test("tbl.changes({squash:false}).map(r.branch(r.row('new'+'_'+'val')('value').lt('2'), r.row, r.expr([]).nth(1))).limit(erroredres.length)('new_val')('value')", "", 'line 59', {}, {'variable': 'postmap_changes2'})
test("tbl.filter(r.branch(r.row('value').lt('2'), true, r.expr([]).nth(1))).changes({squash:false}).limit(erroredres.length)('new_val')('value')", "", 'line 63', {}, {'variable': 'prefilter_changes2'})
test("tbl.changes({squash:false}).filter(r.branch(r.row('new'+'_'+'val')('value').lt('2'), true, r.expr([]).nth(1))).limit(erroredres.length)('new_val')('value')", "", 'line 67', {}, {'variable': 'postfilter_changes2'})
define('function (row) { return r.branch(r.random().gt(0.5), row, r.error("dummy")); }', 'nondetermmap')
define('function (row) { return r.random().gt(0.5); }', 'nondetermfilter')
test('tbl.map(nondetermmap).changes({squash:false})', "err('ReqlQueryLogicError', 'Cannot call `changes` after a non-deterministic function.')", 'line 82', {}, {})
test('tbl.changes({squash:false}).map(nondetermmap).limit(100)', "", 'line 87', {}, {'variable': 'postmap_changes3'})
test('tbl.filter(nondetermfilter).changes({squash:false})', "err('ReqlQueryLogicError', 'Cannot call `changes` after a non-deterministic function.')", 'line 91', {}, {})
test('tbl.changes({squash:false}).filter(nondetermfilter).limit(4)', "", 'line 96', {}, {'variable': 'postfilter_changes3'})
test("tbl.insert(r.range(101).map({'id':r.uuid().coerceTo('binary').slice(0,r.random(4,24)).coerceTo('string'),'value':r.row.coerceTo('string')}))", "({'skipped':0,'deleted':0,'unchanged':0,'errors':0,'replaced':0,'inserted':101})", 'line 100', {}, {})
test('preChanges', 'bag(pre)', 'line 105', {}, {})
test('midChanges', 'bag(mid)', 'line 108', {}, {})
test('postChanges', 'bag(post)', 'line 111', {}, {})
test('premap_changes1', 'bag(erroredres)', 'line 114', {}, {})
test('premap_changes2', 'bag(erroredres)', 'line 117', {}, {})
test('postmap_changes1', 'err(\'ReqlNonExistenceError\', "No attribute `dummy` in object:")', 'line 120', {}, {})
test('postmap_changes2', 'err(\'ReqlNonExistenceError\', "Index out of bounds:" + " 1")', 'line 123', {}, {})
test('postmap_changes3', 'err(\'ReqlUserError\', "dummy")', 'line 126', {}, {})
test('prefilter_changes1', 'bag(erroredres)', 'line 129', {}, {})
test('prefilter_changes2', 'bag(erroredres)', 'line 132', {}, {})
test('postfilter_changes1', 'bag(erroredres)', 'line 135', {}, {})
test('postfilter_changes2', 'bag(erroredres)', 'line 138', {}, {})


the_end()
