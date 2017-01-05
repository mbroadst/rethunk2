#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_mutation_update_js7_2', 'test')
setup_table('tbl2', 'polyglot_mutation_update_js7_2_tbl1', 'test')
setup_table_check()

test('tbl.insert(function(){\nvar res = []\nfor (var i = 0; i < 100; i++) {\nres.push({id:i});\n}\nreturn res;\n}())', "({'deleted':0.0,'replaced':0.0,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':100})", 'line 8', {}, {})
test('tbl.count()', '100', 'line 18', {}, {})
test('tbl2.insert(function(){\nvar res = []\nfor (var i = 0; i < 100; i++) {\nres.push({id:i,foo:{bar:i}});\n}\nreturn res;\n}())', "({'deleted':0.0,'replaced':0.0,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':100})", 'line 23', {}, {})
test('tbl2.count()', '100', 'line 33', {}, {})
test('tbl.get(12).update(function(row) { return row; })', "({'deleted':0.0,'replaced':0.0,'unchanged':1,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 38', {}, {})
test("tbl.get(12).update(function(row) { return {'a':row('id').add(1)}; }, {durability:'soft'})", "({'deleted':0.0,'replaced':1,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 44', {}, {})
test('tbl.get(12)', "({'id':12, 'a':13})", 'line 48', {}, {})
test("tbl.get(12).update(function(row) { return {'a':row('id').add(2)}; }, {durability:'hard'})", "({'deleted':0.0,'replaced':1,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 53', {}, {})
test('tbl.get(12)', "({'id':12, 'a':14})", 'line 57', {}, {})
test("tbl.get(12).update(function(row) { return {'a':row('id').add(3)}; }, {durability:'wrong'})", 'err(\'ReqlQueryLogicError\', \'Durability option `wrong` unrecognized (options are "hard" and "soft").\', [0])', 'line 62', {}, {})
test('tbl.get(12)', "({'id':12, 'a':14})", 'line 66', {}, {})
test("tbl.get(12).update(function(row) { return {'a':row('id')}; })", "({'deleted':0.0,'replaced':1,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 71', {}, {})
test('tbl.get(12)', "({'id':12, 'a':12})", 'line 75', {}, {})
test("tbl.get(12).update({'a':r.literal()})", "({'deleted':0.0,'replaced':1,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 79', {}, {})
test("tbl.between(10, 20).update(function(row) { return {'a':row('id')}; })", "({'deleted':0.0,'replaced':10,'unchanged':0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 85', {}, {})
test("tbl.filter(function(row) { return row('id').ge(10).and(row('id').lt(20))}).update(function(row) { return {'a':row('id')}; })", "({'deleted':0.0,'replaced':0.0,'unchanged':10,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 90', {}, {})
test("tbl.filter(function(row) { return row('id').ge(10).and(row('id').lt(20))}).update(function(row) { return {'b':row('id')}; })", "({'deleted':0.0,'replaced':10,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 95', {}, {})
test("tbl.between(10, 20).update({'a':r.literal()})", "({'deleted':0.0,'replaced':10,'unchanged':0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 100', {}, {})
test("tbl.get(1).update({'id':2,'d':1})", '({\'first_error\':"Primary key `id` cannot be changed (`{\\n\\t\\"id\\":\\t1\\n}` -> `{\\n\\t\\"d\\":\\t1,\\n\\t\\"id\\":\\t2\\n}`).",\'deleted\':0.0,\'replaced\':0.0,\'unchanged\':0.0,\'errors\':1,\'skipped\':0.0,\'inserted\':0.0})', 'line 104', {}, {})
test("tbl.get(1).update({'id':r.row('id'),'d':'b'})", "({'deleted':0.0,'replaced':1,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 109', {}, {})
test("tbl.get(1).update(r.row.merge({'d':'b'}))", "({'deleted':0.0,'replaced':0.0,'unchanged':1,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 114', {}, {})
test("tbl.get(1).update({'d':r.js('5')})", "err('ReqlQueryLogicError', 'Could not prove argument deterministic.  Maybe you want to use the non_atomic flag?', [0])", 'line 119', {}, {})
test("tbl.get(1).update({'d':tbl.nth(0)})", "err('ReqlQueryLogicError', 'Could not prove argument deterministic.  Maybe you want to use the non_atomic flag?', [0])", 'line 122', {}, {})
test("tbl.get(1).update({'d':r.js('5')}, {'nonAtomic':true})", "({'deleted':0.0,'replaced':1,'unchanged':0.0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 126', {}, {})
test("tbl.get(1).update({}, 'foo')", "err('ReqlCompileError', 'Expected 1 argument (not including options) but found 2.')", 'line 130', {}, {})
test("tbl.get(1).update({}, {'foo':'bar'})", "err('ReqlCompileError', 'Unrecognized optional argument `foo`.')", 'line 133', {}, {})
test("tbl.update(function(row) { return {'a':row('id')}; })", "({'deleted':0.0,'replaced':100,'unchanged':0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 138', {}, {})
test("tbl.update({'a':r.literal()})", "({'deleted':0.0,'replaced':100,'unchanged':0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 143', {}, {})
test("tbl2.update({'foo':{'bar':2}})", "({'deleted':0.0,'replaced':99,'unchanged':1,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 147', {}, {})
test("tbl2.update({'foo':r.literal({'bar':2})})", "({'deleted':0.0,'replaced':0,'unchanged':100,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 150', {}, {})
test("tbl2.orderBy('id').nth(0)", "({'id':0,'foo':{'bar':2}})", 'line 156', {}, {})
test("tbl2.update({'foo':{'buzz':2}})", "({'deleted':0.0,'replaced':100,'unchanged':0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 159', {}, {})
test("tbl2.orderBy('id').nth(0)", "({'id':0,'foo':{'bar':2,'buzz':2}})", 'line 162', {}, {})
test("tbl2.update({'foo':r.literal(1)})", "({'deleted':0.0,'replaced':100,'unchanged':0,'errors':0.0,'skipped':0.0,'inserted':0.0})", 'line 165', {}, {})
test("tbl2.orderBy('id').nth(0)", "({'id':0,'foo':1})", 'line 168', {}, {})


the_end()
