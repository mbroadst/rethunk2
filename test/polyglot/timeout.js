#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('./common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table_check()

test("r.js('while(true) {}')", 'err("ReqlQueryLogicError", "JavaScript query `while(true) {}` timed out after 5.000 seconds.", [0])', 'line 5', {}, {})
test("r.js('while(true) {}', {timeout:1.3})", 'err("ReqlQueryLogicError", "JavaScript query `while(true) {}` timed out after 1.300 seconds.", [0])', 'line 9', {}, {})
test("r.js('while(true) {}', {timeout:8})", 'err("ReqlQueryLogicError", "JavaScript query `while(true) {}` timed out after 8.000 seconds.", [0])', 'line 14', {}, {})
test("r.expr('foo').do(r.js('(function(x) { while(true) {} })'))", 'err("ReqlQueryLogicError", "JavaScript query `(function(x) { while(true) {} })` timed out after 5.000 seconds.", [0])', 'line 18', {}, {})
test("r.expr('foo').do(r.js('(function(x) { while(true) {} })', {timeout:1.3}))", 'err("ReqlQueryLogicError", "JavaScript query `(function(x) { while(true) {} })` timed out after 1.300 seconds.", [0])', 'line 22', {}, {})
test("r.expr('foo').do(r.js('(function(x) { while(true) {} })', {timeout:8}))", 'err("ReqlQueryLogicError", "JavaScript query `(function(x) { while(true) {} })` timed out after 8.000 seconds.", [0])', 'line 27', {}, {})
test("r.http('httpbin.org/delay/10', {timeout:0.8})", 'err("ReqlNonExistenceError", "Error in HTTP GET of `httpbin.org/delay/10`:" + " timed out after 0.800 seconds.", [])', 'line 33', {}, {})
test("r.http('httpbin.org/delay/10', {method:'PUT', timeout:0.0})", 'err("ReqlNonExistenceError", "Error in HTTP PUT of `httpbin.org/delay/10`:" + " timed out after 0.000 seconds.", [])', 'line 37', {}, {})


the_end()
