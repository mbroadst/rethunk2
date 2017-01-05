#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_transform_fold_js7_2', 'test')
setup_table_check()

test("tbl.insert(function(){\nvar res = []\nfor (var i = 0; i < 100; i++) {\nres.push({id:i, 'a':i%4});\n}\nreturn res;\n}())", "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':100})", 'line 8', {}, {})
test('r.range(0, 10).fold(0, function(acc, row) { return acc.add(1); })', '10', 'line 20', {}, {})
test('r.range(0, 10).fold(0, function(acc, row) { return acc.add(1); }, {"final_emit": function(acc) {return acc.mul(2);}})', '20', 'line 24', {}, {})
test('r.range(0, 10).fold(0, function(acc, row) { return acc.add(1); }, {"emit": function(old,row,acc) {return [row];}}).coerceTo("array")', '[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]', 'line 28', {}, {})
test('r.range(0, 10).fold(0, function(acc, row) {return acc.add(1);}, {"emit":function(old,row,n) {return r.branch(n.mod(3).eq(0),[row],[])}, "final_emit" : function (acc) {return [acc]}}).coerceTo("array")', '[2, 5, 8, 10]', 'line 32', {}, {})

the_end()
