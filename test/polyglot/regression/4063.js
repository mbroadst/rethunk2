#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_regression_4063_js7_2', 'test')
setup_table_check()

test('tbl.filter(function(d){ return d("l").intersects(r.polygon([1,2],[2,2],[2,1],[1,1])) }).changes()', "", 'line 4', {}, {'variable': 'changefeed'})
test('tbl.insert([{"l":r.point(1.5,1.5), "id":1}])', "partial({'errors':0, 'inserted':1})", 'line 6', {}, {})
test('fetch(changefeed, 1)', '[{"new_val":{"l":{"$reql_type$":"GEOMETRY","coordinates":[1.5,1.5],"type":"Point"}, "id":1}, "old_val":null}]', 'line 8', {}, {})


the_end()
