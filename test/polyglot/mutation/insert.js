#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_mutation_insert_js7_2', 'test')
setup_table_check()

test("r.db('test').tableCreate('test2')", "partial({'tables_created':1})", 'line 6', {}, {})
define("r.db('test').table('test2')", 'tbl2')
test("tbl.insert({'id':0,'a':0})", "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':1})", 'line 12', {}, {})
test('tbl.count()', '1', 'line 14', {}, {})
test("tbl.insert({id:1, a:1}, {durability:'hard'})", "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':1})", 'line 19', {}, {})
test('tbl.count()', '2', 'line 22', {}, {})
test("tbl.insert({id:2, a:2}, {durability:'soft'})", "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':1})", 'line 27', {}, {})
test('tbl.count()', '3', 'line 30', {}, {})
test("tbl.insert({id:3, a:3}, {durability:'wrong'})", 'err(\'ReqlQueryLogicError\', \'Durability option `wrong` unrecognized (options are "hard" and "soft").\', [0])', 'line 35', {}, {})
test('tbl.count()', '3', 'line 38', {}, {})
test('tbl.get(2).delete()', "({'deleted':1,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':0})", 'line 42', {}, {})
test("tbl.insert([{'id':2,'a':2}, {'id':3,'a':3}])", "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':2})", 'line 46', {}, {})
test('tbl2.insert(tbl)', "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':4})", 'line 50', {}, {})
test("tbl.insert({'id':2,'b':20})", '({\'first_error\':"Duplicate primary key `id`:\\n{\\n\\t\\"a\\":\\t2,\\n\\t\\"id\\":\\t2\\n}\\n{\\n\\t\\"b\\":\\t20,\\n\\t\\"id\\":\\t2\\n}",\'deleted\':0,\'replaced\':0,\'unchanged\':0,\'errors\':1,\'skipped\':0,\'inserted\':0})', 'line 54', {}, {})
test("tbl.insert({'id':2,'b':20}, {conflict:'error'})", '({\'first_error\':"Duplicate primary key `id`:\\n{\\n\\t\\"a\\":\\t2,\\n\\t\\"id\\":\\t2\\n}\\n{\\n\\t\\"b\\":\\t20,\\n\\t\\"id\\":\\t2\\n}",\'deleted\':0,\'replaced\':0,\'unchanged\':0,\'errors\':1,\'skipped\':0,\'inserted\':0})', 'line 59', {}, {})
test("tbl.insert({'id':15,'b':20}, {conflict:'error'})", "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':1})", 'line 65', {}, {})
test('tbl.get(15)', "({'id':15,'b':20})", 'line 69', {}, {})
test("tbl.insert({'id':2,'b':20}, {conflict:'replace'})", "({'deleted':0,'replaced':1,'unchanged':0,'errors':0,'skipped':0,'inserted':0})", 'line 74', {}, {})
test('tbl.get(2)', "({'id':2,'b':20})", 'line 78', {}, {})
test("tbl.insert({'id':20,'b':20}, {conflict:'replace'})", "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':1})", 'line 83', {}, {})
test('tbl.get(20)', "({'id':20,'b':20})", 'line 87', {}, {})
test("tbl.insert({'id':2,'c':30}, {conflict:'update'})", "({'deleted':0,'replaced':1,'unchanged':0,'errors':0,'skipped':0,'inserted':0})", 'line 92', {}, {})
test('tbl.get(2)', "({'id':2, 'b':20, 'c':30})", 'line 96', {}, {})
test("tbl.insert({'id':30,'b':20}, {conflict:'update'})", "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':1})", 'line 101', {}, {})
test('tbl.get(30)', "({'id':30,'b':20})", 'line 105', {}, {})
test("tbl.insert({id:3, a:3}, {conflict:'wrong'})", 'err(\'ReqlQueryLogicError\', \'Conflict option `wrong` unrecognized (options are "error", "replace" and "update").\', [0])', 'line 110', {}, {})
define("r.db('test').table('testpkey')", 'tblpkey')
test("r.db('test').tableCreate('testpkey', {primaryKey:'foo'})", "partial({'tables_created':1})", 'line 116', {}, {})
test('tblpkey.insert({})', "({'deleted':0,'replaced':0,'generated_keys':arrlen(1,uuid()),'unchanged':0,'errors':0,'skipped':0,'inserted':1})", 'line 122', {}, {})
test('tblpkey', "[{'foo':uuid()}]", 'line 125', {}, {})
test("tblpkey.insert({'b':20}, {conflict:'replace'})", "({'deleted':0,'replaced':0,'generated_keys':arrlen(1,uuid()),'unchanged':0,'errors':0,'skipped':0,'inserted':1})", 'line 130', {}, {})
test("tblpkey.insert({'b':20}, {conflict:'update'})", "({'deleted':0,'replaced':0,'generated_keys':arrlen(1,uuid()),'unchanged':0,'errors':0,'skipped':0,'inserted':1})", 'line 136', {}, {})
test("r.db('test').tableDrop('testpkey')", "partial({'tables_dropped':1})", 'line 140', {}, {})
test("tbl.forEach(function(row) { return tbl2.insert(row.merge({'id':row('id').add(100)})); })", "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':7})", 'line 145', {}, {})
test("tbl.insert({'value':r.minval})", "partial({'errors':1,'first_error':'`r.minval` and `r.maxval` cannot be written to disk.'})", 'line 150', {}, {})
test("tbl.insert({'value':r.maxval})", "partial({'errors':1,'first_error':'`r.minval` and `r.maxval` cannot be written to disk.'})", 'line 154', {}, {})
test("tbl.insert({'id':42, 'foo':1, 'bar':1})", "partial({'inserted':1})", 'line 192', {}, {})
test('tbl.insert({\'id\':42, \'foo\':7, \'bar\':7}, {conflict: function(id, oldRow, newRow) {return oldRow.merge(newRow.pluck("bar"))}})', "partial({'replaced':1})", 'line 202', {}, {})
test('tbl.get(42)', "({'id':42, 'foo':1, 'bar':7})", 'line 204', {}, {})
test('tbl.insert({id: "toggle"},{conflict: function(x,y,z) { return null},returnChanges: true})', "partial({'inserted': 1})", 'line 208', {}, {})
test('tbl.insert({id: "toggle"},{conflict: function(x,y,z) { return null},returnChanges: true})', "partial({'deleted': 1})", 'line 210', {}, {})
test('r.minval', "err('ReqlQueryLogicError','Cannot convert `r.minval` to JSON.')", 'line 231', {}, {})
test('r.maxval', "err('ReqlQueryLogicError','Cannot convert `r.maxval` to JSON.')", 'line 234', {}, {})
test("r.db('test').tableDrop('test2')", "partial({'tables_dropped':1})", 'line 238', {}, {})


the_end()
