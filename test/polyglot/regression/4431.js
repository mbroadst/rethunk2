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

test("r.table('test')", "err('ReqlQueryLogicError', 'The `use_outdated` optarg is no longer supported.  Use the `read_mode` optarg instead.')", 'line 3', {'use_outdated': 'true'}, {})
test("r.table('test', {useOutdated:true})", "err('ReqlQueryLogicError', 'The `use_outdated` optarg is no longer supported.  Use the `read_mode` optarg instead.')", 'line 9', {}, {})


the_end()
