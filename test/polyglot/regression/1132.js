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

test('r.json(\'{"a":1,"a":2}\')', 'err("ReqlQueryLogicError", "Duplicate key \\"a\\" in JSON.", [])', 'line 3', {}, {})


the_end()
