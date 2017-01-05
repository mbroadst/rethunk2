#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('./common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_polymorphism_js7_2', 'test')
setup_table_check()

define("r.expr({'id':0,'a':0})", 'obj')
test("tbl.insert(function(){\nvar res = []\nfor (var i = 0; i < 3; i++) {\nres.push({id:i, 'a':i});\n}\nreturn res;\n}())", "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':3})", 'line 9', {}, {})
test("tbl.merge({'c':1}).nth(0)", "({'id':0,'c':1,'a':0})", 'line 21', {}, {})
test("obj.merge({'c':1})", "({'id':0,'c':1,'a':0})", 'line 22', {}, {})
test("tbl.without('a').nth(0)", "({'id':0})", 'line 26', {}, {})
test("obj.without('a')", "({'id':0})", 'line 27', {}, {})
test("tbl.pluck('a').nth(0)", "({'a':0})", 'line 31', {}, {})
test("obj.pluck('a')", "({'a':0})", 'line 32', {}, {})

the_end()
