#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_transform_table_js7_2', 'test')
setup_table_check()

test('tbl.insert([{"a":["k1","v1"]},{"a":["k2","v2"]}])', "", 'line 5', {}, {})
test('tbl.map(r.row("a")).coerceTo("object")', '({"k1":"v1","k2":"v2"})', 'line 8', {}, {})
test('tbl.limit(1).typeOf()', '"SELECTION<STREAM>"', 'line 14', {}, {})
test("tbl.limit(1).coerceTo('array').typeOf()", '"ARRAY"', 'line 17', {}, {})

the_end()
