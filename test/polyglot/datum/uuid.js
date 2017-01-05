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

test('r.uuid()', 'uuid()', 'line 3', {}, {})
test('r.expr(r.uuid())', 'uuid()', 'line 5', {}, {})
test('r.typeOf(r.uuid())', "'STRING'", 'line 7', {}, {})
test('r.uuid().ne(r.uuid())', 'true', 'line 9', {}, {})
test("r.uuid('magic')", "('97dd10a5-4fc4-554f-86c5-0d2c2e3d5330')", 'line 11', {}, {})
test("r.uuid('magic').eq(r.uuid('magic'))", 'true', 'line 13', {}, {})
test("r.uuid('magic').ne(r.uuid('beans'))", 'true', 'line 15', {}, {})
test('r([1,2,3,4,5,6,7,8,9,10]).map(function(u) {return r.uuid();}).distinct().count()', '10', 'line 18', {}, {})


the_end()
