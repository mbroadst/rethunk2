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

test('r.point(0, 1).typeOf()', '("PTYPE<GEOMETRY>")', 'line 3', {}, {})
test("r.point(0, 1).info()('type')", '("PTYPE<GEOMETRY>")', 'line 6', {}, {})


the_end()
