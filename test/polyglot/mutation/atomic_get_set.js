#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_mutation_atomic_get_set_js7_2', 'test')
setup_table_check()

test("tbl.insert({'id':0}, {'return_vals':true}).pluck('changes', 'first_error')", 'err("ReqlQueryLogicError", "Error:"+" encountered obsolete optarg `return_vals`.  Use `return_changes` instead.", [0])', 'line 8', {}, {})
test("tbl.insert({'id':0}, {'return_changes':true}).pluck('changes', 'first_error')", "({'changes':[{'old_val':null,'new_val':{'id':0}}]})", 'line 13', {}, {})
test("tbl.insert({'id':0}, {'return_changes':true}).pluck('changes', 'first_error')", '({\'changes\':[], \'first_error\':"Duplicate primary key `id`:\\n{\\n\\t\\"id\\":\\t0\\n}\\n{\\n\\t\\"id\\":\\t0\\n}"})', 'line 17', {}, {})
test("tbl.insert({'id':0}, {'return_changes':'always'}).pluck('changes', 'first_error')", '({\'first_error\':"Duplicate primary key `id`:\\n{\\n\\t\\"id\\":\\t0\\n}\\n{\\n\\t\\"id\\":\\t0\\n}",\'changes\':[{\'old_val\':{\'id\':0},\'new_val\':{\'id\':0},\'error\':"Duplicate primary key `id`:\\n{\\n\\t\\"id\\":\\t0\\n}\\n{\\n\\t\\"id\\":\\t0\\n}"}]})', 'line 21', {}, {})
test("tbl.insert([{'id':1}], {'return_changes':true})", "({'changes':[{'new_val':{'id':1},'old_val':null}], 'errors':0, 'deleted':0, 'unchanged':0, 'skipped':0, 'replaced':0, 'inserted':1})", 'line 25', {}, {})
test("tbl.insert([{'id':0}], {'return_changes':true}).pluck('changes', 'first_error')", '({\'changes\':[],\'first_error\':"Duplicate primary key `id`:\\n{\\n\\t\\"id\\":\\t0\\n}\\n{\\n\\t\\"id\\":\\t0\\n}"})', 'line 29', {}, {})
test("tbl.get(0).update({'x':1}, {'return_changes':true}).pluck('changes', 'first_error')", "({'changes':[{'old_val':{'id':0},'new_val':{'id':0,'x':1}}]})", 'line 34', {}, {})
test('tbl.get(0).update({\'x\':r.error("a")}, {\'return_changes\':true}).pluck(\'changes\', \'first_error\')', "({'changes':[],'first_error':'a'})", 'line 38', {}, {})
test("tbl.update({'x':3}, {'return_changes':true}).pluck('changes', 'first_error').do(function(p){return p.merge({'changes':p('changes').orderBy(function(a){return a('old_val')('id')})})})", "({'changes':[{'old_val':{'id':0, 'x':1},'new_val':{'id':0, 'x':3}}, {'old_val':{'id':1},'new_val':{'id':1, 'x':3}}]})", 'line 42', {}, {})
test("tbl.get(0).replace({'id':0,'x':2}, {'return_changes':true}).pluck('changes', 'first_error')", "({'changes':[{'old_val':{'id':0,'x':3},'new_val':{'id':0,'x':2}}]})", 'line 47', {}, {})
test("tbl.get(0).replace(function(y){return {'x':r.error('a')}}, {'return_changes':true}).pluck('changes', 'first_error')", "({'changes':[],'first_error':'a'})", 'line 51', {}, {})
test("tbl.get(0).replace(function(y){return {'x':r.error('a')}}, {'return_changes':'always'}).pluck('changes', 'first_error')", "({'first_error':'a','changes':[{'old_val':{'id':0,'x':2},'new_val':{'id':0,'x':2},'error':'a'}]})", 'line 55', {}, {})
test("tbl.replace(function(p){return p.without('x')}, {'return_changes':true}).pluck('changes', 'first_error').do(function(p){return p.merge({'changes':p('changes').orderBy(function(a){return a('old_val')('id')})})})", "({'changes':[{'new_val':{'id':0},'old_val':{'id':0, 'x':2}}, {'new_val':{'id':1},'old_val':{'id':1,'x':3}}]})", 'line 59', {}, {})
test("tbl.replace({'x':1}, {'return_changes':'always'}).pluck('changes', 'first_error').do(function(p){return p.merge({'changes':p('changes').orderBy(function(a){return a('old_val')('id')})})})", '({\'first_error\':"Inserted object must have primary key `id`:\\n{\\n\\t\\"x\\":\\t1\\n}", \'changes\':[{\'new_val\':{\'id\':0},\'old_val\':{\'id\':0}, \'error\':"Inserted object must have primary key `id`:\\n{\\n\\t\\"x\\":\\t1\\n}"}, {\'new_val\':{\'id\':1},\'old_val\':{\'id\':1},\'error\':"Inserted object must have primary key `id`:\\n{\\n\\t\\"x\\":\\t1\\n}"}]})', 'line 63', {}, {})
test("tbl.get(0).delete({'return_changes':true}).pluck('changes', 'first_error')", "({'changes':[{'old_val':{'id':0},'new_val':null}]})", 'line 87', {}, {})
test("tbl.delete({'return_changes':true})", "({'deleted':1,'errors':0,'inserted':0,'replaced':0,'skipped':0,'unchanged':0,'changes':[{'new_val':null, 'old_val':{'id':1}}]})", 'line 91', {}, {})

the_end()
