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

test('r.expr([{"x":2},{"x":1}]).orderBy(r.args(["x","y"]))', "err('ReqlQueryLogicError','r.args is not supported in an order_by or union command yet.')", 'line 3', {}, {})


the_end()
