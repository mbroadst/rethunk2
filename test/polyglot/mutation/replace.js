#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_mutation_replace_js7_2', 'test')
setup_table_check()

test('tbl.insert(function(){\nvar res = []\nfor (var i = 0; i < 100; i++) {\nres.push({id:i});\n}\nreturn res;\n}())', "({'deleted':0.0,'replaced':0.0,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':100})", 'line 9', {}, {})
test('tbl.count()', '100', 'line 19', {}, {})
test("tbl.get(12).replace(function(row) { return {'id':row('id')}; })", "({'deleted':0.0,'replaced':0.0,'unchanged':1,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 25', {}, {})
test("tbl.get(12).replace(function(row) { return {'id':row('id'), 'a':row('id')}; })", "({'deleted':0.0,'replaced':1,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 32', {}, {})
test('tbl.get(13).replace(function(row) { return null; })', "({'deleted':1,'replaced':0.0,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 37', {}, {})
test("tbl.between(10, 20, {'right_bound':'closed'}).replace(function(row) { return {'a':1}; })", '({\'first_error\':\'Inserted object must have primary key `id`:\\n{\\n\\t\\"a\\":\\t1\\n}\',\'deleted\':0.0,\'replaced\':0.0,\'unchanged\':0.0,\'errors\':10,\'skipped\':0.0,\'inserted\':0.0})', 'line 44', {}, {})
test("tbl.filter(function(row) { return row('id').ge(10).and(row('id').lt(20))}).replace(function(row) { return {'id':row('id'), 'a':row('id')}; })", "({'deleted':0.0,'replaced':8,'unchanged':1,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 48', {}, {})
test("tbl.get(1).replace({'id':2,'a':1})", '({\'first_error\':"Primary key `id` cannot be changed (`{\\n\\t\\"id\\":\\t1\\n}` -> `{\\n\\t\\"a\\":\\t1,\\n\\t\\"id\\":\\t2\\n}`).",\'deleted\':0.0,\'replaced\':0.0,\'unchanged\':0.0,\'errors\':1,\'skipped\':0.0,\'inserted\':0.0})', 'line 56', {}, {})
test("tbl.get(1).replace({'a':1})", '({\'first_error\':"Inserted object must have primary key `id`:\\n{\\n\\t\\"a\\":\\t1\\n}",\'deleted\':0.0,\'replaced\':0.0,\'unchanged\':0.0,\'errors\':1,\'skipped\':0.0,\'inserted\':0.0})', 'line 61', {}, {})
test("tbl.get(1).replace({'id':r.row('id'),'a':'b'})", "({'deleted':0.0,'replaced':1,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 66', {}, {})
test("tbl.get(1).replace(r.row.merge({'a':'b'}))", "({'deleted':0.0,'replaced':0.0,'unchanged':1,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 70', {}, {})
test("tbl.get(1).replace(r.row.merge({'c':r.js('5')}))", "err('ReqlQueryLogicError', 'Could not prove argument deterministic.  Maybe you want to use the non_atomic flag?', [0])", 'line 75', {}, {})
test("tbl.get(1).replace(r.row.merge({'c':tbl.nth(0)}))", "err('ReqlQueryLogicError', 'Could not prove argument deterministic.  Maybe you want to use the non_atomic flag?', [0])", 'line 79', {}, {})
test("tbl.get(1).replace(r.row.merge({'c':r.js('5')}), {'nonAtomic':true})", "({'deleted':0.0,'replaced':1,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 84', {}, {})
test("tbl.get(1).replace({}, 'foo')", "err('ReqlCompileError', 'Expected 1 argument (not including options) but found 2.')", 'line 88', {}, {})
test("tbl.get(1).replace({}, {'foo':'bar'})", "err('ReqlCompileError', 'Unrecognized optional argument `foo`.')", 'line 93', {}, {})
test('tbl.replace(function(row) { return null; })', "({'deleted':99,'replaced':0.0,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 100', {}, {})
test("tbl.get('sdfjk').replace({'id':'sdfjk'})('inserted')", '1', 'line 105', {}, {})
test("tbl.get('sdfjki').replace({'id':'sdfjk'})('errors')", '1', 'line 108', {}, {})


the_end()
