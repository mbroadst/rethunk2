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

test('r.expr({"a":{"b":1, "c":2}}).merge(r.json(\'{"a":{"$reql_\'+\'type$":"LITERAL", "value":{"b":2}}}\'))', "({'a':{'b':2}})", 'line 3', {}, {})


the_end()
