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

test('r({})', '({})', 'line 4', {}, {})
test('r.expr({})', '({})', 'line 5', {}, {})
test('r({a:1})', "({'a':1})", 'line 9', {}, {})
test("r.expr({'a':1})", "({'a':1})", 'line 10', {}, {})
test("r({a:1, b:'two', c:true})", "({'a':1, 'b':'two', 'c':true})", 'line 14', {}, {})
test("r.expr({'a':1, 'b':'two', 'c':true})", "({'a':1, 'b':'two', 'c':true})", 'line 15', {}, {})
test("r.expr({'a':r.expr(1)})", "({'a':1})", 'line 20', {}, {})
test("r.expr({'a':{'b':[{'c':2}, 'a', 4]}})", "({'a':{'b':[{'c':2}, 'a', 4]}})", 'line 23', {}, {})
test("r.expr({'a':1}).typeOf()", "'OBJECT'", 'line 26', {}, {})
test("r.expr({'a':1}).coerceTo('string')", '\'{"a":1}\'', 'line 30', {}, {})
test("r.expr({'a':1}).coerceTo('object')", "({'a':1})", 'line 34', {}, {})
test("r.expr({'a':1}).coerceTo('array')", "[['a',1]]", 'line 37', {}, {})
test("r({'a':undefined})", 'err("ReqlCompileError", "Object field \'a\' may not be undefined")', 'line 51', {}, {})
test("r({'a':{'b':undefined}})", 'err("ReqlCompileError", "Object field \'b\' may not be undefined")', 'line 54', {}, {})
test('r.expr({}, "foo")', 'err("ReqlCompileError", "Second argument to `r.expr` must be a number or undefined.")', 'line 57', {}, {})
test('r.expr({}, NaN)', 'err("ReqlCompileError", "Second argument to `r.expr` must be a number or undefined.")', 'line 62', {}, {})
test('r.object()', '({})', 'line 66', {}, {})
test("r.object('a', 1, 'b', 2)", "({'a':1,'b':2})", 'line 69', {}, {})
test("r.object('c'+'d', 3)", "({'cd':3})", 'line 72', {}, {})
test("r.object('o','d','d')", 'err("ReqlQueryLogicError", "OBJECT expects an even number of arguments (but found 3).", [])', 'line 75', {}, {})
test('r.object(1, 1)', 'err("ReqlQueryLogicError","Expected type STRING but found NUMBER.",[])', 'line 78', {}, {})
test("r.object('e', 4, 'e', 5)", 'err("ReqlQueryLogicError","Duplicate key \\"e\\" in object.  (got 4 and 5 as values)",[])', 'line 81', {}, {})
test("r.object('g', r.db('test'))", 'err("ReqlQueryLogicError","Expected type DATUM but found DATABASE:",[])', 'line 84', {}, {})


the_end()
