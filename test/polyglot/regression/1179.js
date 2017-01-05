#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_1179_js7_2', 'test')
setup_table_check()

test('r.expr([1])(r.expr(0))', '1', 'line 4', {}, {})
test('r.expr({"foo":1})(\'foo\')', '1', 'line 8', {}, {})
test('r.expr([1])(0)', '1', 'line 10', {}, {})
test("tbl.insert([{'id':42},{'id':4},{'id':89},{'id':6},{'id':43}]).pluck('inserted','first_error')", "({'inserted':5})", 'line 12', {}, {})
test("tbl.group('id')(0)", '([{"group":4,"reduction":{"id":4}},{"group":6,"reduction":{"id":6}},{"group":42,"reduction":{"id":42}},{"group":43,"reduction":{"id":43}},{"group":89,"reduction":{"id":89}}] )', 'line 16', {}, {})
test("tbl.coerceTo('array').group('id')(0)", '([{"group":4,"reduction":{"id":4}},{"group":6,"reduction":{"id":6}},{"group":42,"reduction":{"id":42}},{"group":43,"reduction":{"id":43}},{"group":89,"reduction":{"id":89}}] )', 'line 18', {}, {})
test("tbl.group('id').nth(0)", '([{"group":4,"reduction":{"id":4}},{"group":6,"reduction":{"id":6}},{"group":42,"reduction":{"id":42}},{"group":43,"reduction":{"id":43}},{"group":89,"reduction":{"id":89}}] )', 'line 22', {}, {})
test("tbl.coerceTo('array').group('id').nth(0)", '([{"group":4,"reduction":{"id":4}},{"group":6,"reduction":{"id":6}},{"group":42,"reduction":{"id":42}},{"group":43,"reduction":{"id":43}},{"group":89,"reduction":{"id":89}}] )', 'line 24', {}, {})


the_end()
