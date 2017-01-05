#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('../common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table('tbl', 'polyglot_mutation_delete_js7_2', 'test')
setup_table_check()

test('tbl.insert(function(){\nvar res = []\nfor (var i = 0; i < 100; i++) {\nres.push({id: i});\n}\nreturn res;\n}())', "({'deleted':0,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':100})", 'line 9', {}, {})
test('tbl.count()', '100', 'line 19', {}, {})
test('tbl.get(12).delete()', "({'deleted':1,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':0})", 'line 24', {}, {})
test("tbl.skip(50).delete({durability:'wrong'})", 'err(\'ReqlQueryLogicError\', \'Durability option `wrong` unrecognized (options are "hard" and "soft").\', [0])', 'line 29', {}, {})
test("tbl.skip(50).delete({durability:'soft'})", "({'deleted':49,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':0})", 'line 36', {}, {})
test("tbl.delete({durability:'hard'})", "({'deleted':50,'replaced':0,'unchanged':0,'errors':0,'skipped':0,'inserted':0})", 'line 43', {}, {})
test('r.expr([1, 2]).delete()', "err('ReqlQueryLogicError', 'Expected type SELECTION but found DATUM:', [0])", 'line 49', {}, {})


the_end()
