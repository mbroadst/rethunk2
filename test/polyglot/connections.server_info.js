#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('./common'),
      setup_table_check = common.setup_table_check,
      test = common.test,
      the_end = common.the_end;

setup_table_check()

test('conn.server()', '({"id": uuid(), "name": regex(\'.+\'), "proxy": false})', 'line 3', {}, {})

the_end()
