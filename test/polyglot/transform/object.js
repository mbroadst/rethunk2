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

define('r.expr({\'a\':1, \'b\':2,\'c\':"str",\'d\':null,\'e\':{\'f\':\'buzz\'}})', 'obj')
test("obj('a')", '1', 'line 11', {}, {})
test("obj.getField('a')", '1', 'line 12', {}, {})
test("obj('c')", "'str'", 'line 16', {}, {})
test("obj.getField('c')", "'str'", 'line 17', {}, {})
test("obj.hasFields('b')", 'true', 'line 22', {}, {})
test("obj.keys().contains('d')", 'true', 'line 24', {}, {})
test("obj.hasFields('d')", 'false', 'line 26', {}, {})
test("obj.hasFields({'e':'f'})", 'true', 'line 28', {}, {})
test("obj.hasFields({'e':'g'})", 'false', 'line 30', {}, {})
test("obj.hasFields('f')", 'false', 'line 32', {}, {})
test("obj.hasFields('a', 'b')", 'true', 'line 36', {}, {})
test("obj.hasFields('a', 'd')", 'false', 'line 38', {}, {})
test("obj.hasFields('a', 'f')", 'false', 'line 40', {}, {})
test("obj.hasFields('a', {'e':'f'})", 'true', 'line 42', {}, {})
test("r.expr([obj, obj.pluck('a', 'b')]).hasFields('a', 'b').count()", '2', 'line 46', {}, {})
test("r.expr([obj, obj.pluck('a', 'b')]).hasFields('a', 'c').count()", '1', 'line 48', {}, {})
test("r.expr([obj, obj.pluck('a', 'e')]).hasFields('a', {'e':'f'}).count()", '2', 'line 50', {}, {})
test("obj.pluck('a')", "({'a':1})", 'line 55', {}, {})
test("obj.pluck('a', 'b')", "({'a':1, 'b':2})", 'line 57', {}, {})
test("obj.without('a')", "({'b':2, 'c':'str', 'd':null, 'e':{'f':'buzz'}})", 'line 62', {}, {})
test("obj.without('a', 'b')", "({'c':'str', 'd':null,'e':{'f':'buzz'}})", 'line 64', {}, {})
test("obj.without('a', 'b', 'c', 'd')", "({'e':{'f':'buzz'}})", 'line 66', {}, {})
test("obj.without({'e':'f'})", "({'a':1, 'b':2, 'c':'str', 'd':null, 'e':{}})", 'line 68', {}, {})
test("obj.without({'e':'buzz'})", "({'a':1, 'b':2, 'c':'str', 'd':null, 'e':{'f':'buzz'}})", 'line 70', {}, {})
test('obj.merge(1)', '1', 'line 77', {}, {})
test("obj.merge({'e':-2})", "({'a':1, 'b':2, 'c':'str', 'd':null, 'e':-2})", 'line 81', {}, {})
test("obj.merge({'e':r.literal()})", "({'a':1, 'b':2, 'c':'str', 'd':null})", 'line 85', {}, {})
test("obj.merge({'e':{'f':'quux'}})", "({'a':1, 'b':2, 'c':'str', 'd':null, 'e':{'f':'quux'}})", 'line 89', {}, {})
test("obj.merge({'e':{'g':'quux'}})", "({'a':1, 'b':2, 'c':'str', 'd':null, 'e':{'f':'buzz', 'g':'quux'}})", 'line 92', {}, {})
test("obj.merge({'e':r.literal({'g':'quux'})})", "({'a':1, 'b':2, 'c':'str', 'd':null, 'e':{'g':'quux'}})", 'line 95', {}, {})
test("obj.merge({'a':-1})", "({'a':-1, 'b':2, 'c':'str', 'd':null, 'e':{'f':'buzz'}})", 'line 99', {}, {})
define("'Stray literal keyword found:'+' literal is only legal inside of the object passed to merge or update and cannot nest inside other literals.'", 'errmsg')
test("r.literal('foo')", 'err("ReqlQueryLogicError", errmsg, [])', 'line 105', {}, {})
test("obj.merge(r.literal('foo'))", 'err("ReqlQueryLogicError", errmsg, [])', 'line 108', {}, {})
test("obj.merge({'foo':r.literal(r.literal('foo'))})", 'err("ReqlQueryLogicError", errmsg, [])', 'line 111', {}, {})
define("r.expr({'a':{'b':1, 'c':2}, 'd':3})", 'o')
test("o.merge({'e':4}, {'f':5})", "({'a':{'b':1, 'c':2}, 'd':3, 'e':4, 'f':5})", 'line 116', {}, {})
test("r.expr([o, o.merge({'d':4})]).merge(function(row){return {'e':row('d')}})", "([{'a':{'b':1, 'c':2}, 'd':3, 'e':3}, {'a':{'b':1, 'c':2}, 'd':4, 'e':4}])", 'line 121', {}, {})
test("r.expr([o, o.merge({'d':4})]).merge({'e':r.row('d')})", "([{'a':{'b':1, 'c':2}, 'd':3, 'e':3}, {'a':{'b':1, 'c':2}, 'd':4, 'e':4}])", 'line 125', {}, {})
test("r.expr([o, o.merge({'d':4})]).merge(function(row){return {'a':{'b':2}}})", "([{'a':{'b':2, 'c':2}, 'd':3}, {'a':{'b':2, 'c':2}, 'd':4}])", 'line 130', {}, {})
test("r.expr([o, o.merge({'d':4})]).merge(function(row){return {'a':r.literal({'b':2})}})", "([{'a':{'b':2}, 'd':3}, {'a':{'b':2}, 'd':4}])", 'line 135', {}, {})
test('obj.keys()', "(['a', 'b', 'c', 'd', 'e'])", 'line 139', {}, {})
test('obj.values()', "([1, 2, 'str', null, {'f':'buzz'}])", 'line 142', {}, {})
test('obj.count()', '5', 'line 146', {}, {})

the_end()
