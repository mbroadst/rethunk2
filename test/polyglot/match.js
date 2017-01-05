#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('./common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_match_js7_2', 'test')
setup_table_check()

test('r.expr("abcdefg").match("a(b.e)|b(c.e)")', "({'str':'bcde','groups':[null,{'start':2,'str':'cde','end':5}],'start':1,'end':5})", 'line 4', {}, {})
test('r.expr("abcdefg").match("a(b.e)|B(c.e)")', '(null)', 'line 6', {}, {})
test('r.expr("abcdefg").match("(?i)a(b.e)|B(c.e)")', "({'str':'bcde','groups':[null,{'start':2,'str':'cde','end':5}],'start':1,'end':5})", 'line 8', {}, {})
test('r.expr(["aba", "aca", "ada", "aea"]).filter(function(row){return row.match("a(.)a")(\'groups\').nth(0)(\'str\').match("[cd]")})', '(["aca", "ada"])', 'line 13', {}, {})
test("tbl.insert([{'id':0,'a':'abc'},{'id':1,'a':'ab'},{'id':2,'a':'bc'}])", "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':3})", 'line 16', {}, {})
test("tbl.filter(function(row){return row('a').match('b')}).orderBy('id')", "([{'id':0,'a':'abc'},{'id':1,'a':'ab'},{'id':2,'a':'bc'}])", 'line 21', {}, {})
test("tbl.filter(function(row){return row('a').match('ab')}).orderBy('id')", "([{'id':0,'a':'abc'},{'id':1,'a':'ab'}])", 'line 25', {}, {})
test("tbl.filter(function(row){return row('a').match('ab$')}).orderBy('id')", "([{'id':1,'a':'ab'}])", 'line 29', {}, {})
test("tbl.filter(function(row){return row('a').match('^b$')}).orderBy('id')", '([])', 'line 33', {}, {})
test('r.expr("").match("ab\\\\9")', 'err("ReqlQueryLogicError", "Error in regexp `ab\\\\9` (portion `\\\\9`): invalid escape sequence: \\\\9", [])', 'line 36', {}, {})

the_end()
