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

test("r.now()('epoch_time')", 'err("ReqlQueryLogicError", "Cannot call `bracket` on objects of type `PTYPE<TIME>`.")', 'line 4', {}, {})
test("r.now().getField('epoch_time')", 'err("ReqlQueryLogicError", "Cannot call `get_field` on objects of type `PTYPE<TIME>`.")', 'line 6', {}, {})
test('r.now().keys()', 'err("ReqlQueryLogicError", "Cannot call `keys` on objects of type `PTYPE<TIME>`.")', 'line 8', {}, {})
test("r.now().pluck('epoch_time')", 'err("ReqlQueryLogicError", "Cannot call `pluck` on objects of type `PTYPE<TIME>`.")', 'line 10', {}, {})
test("r.now().without('epoch_time')", 'err("ReqlQueryLogicError", "Cannot call `without` on objects of type `PTYPE<TIME>`.")', 'line 12', {}, {})
test('r.now().merge({"foo":4})', 'err("ReqlQueryLogicError", "Cannot call `merge` on objects of type `PTYPE<TIME>`.")', 'line 14', {}, {})
test('r.expr({"foo":4}).merge(r.now())', 'err("ReqlQueryLogicError", "Cannot merge objects of type `PTYPE<TIME>`.")', 'line 17', {}, {})
test("r.now().hasFields('epoch_time')", 'err("ReqlQueryLogicError", "Cannot call `has_fields` on objects of type `PTYPE<TIME>`.")', 'line 20', {}, {})
test("r.object().hasFields(r.time(2014, 7, 7, 'Z'))", 'err("ReqlQueryLogicError", "Invalid path argument `1404691200`.")', 'line 22', {}, {})
test('r.expr(1).keys()', 'err("ReqlQueryLogicError", "Cannot call `keys` on objects of type `NUMBER`.")', 'line 24', {}, {})


the_end()
