#!/usr/local/bin/node
// -*- coding: utf-8 -*-

'use strict';
const common = require('./common'),
      setup_table = common.setup_table,
      setup_table_check = common.setup_table_check,
      test = common.test,
      define = common.define,
      the_end = common.the_end;

setup_table_check()

test('r.expr([1,2,3]).sample(3).distinct().count()', '3', 'line 5', {}, {})
test('r.expr([1,2,3]).sample(3).count()', '3', 'line 7', {}, {})
test('r.expr([1,2,3,4,5,6]).sample(3).distinct().count()', '3', 'line 9', {}, {})
test('r.expr([1,2,3]).sample(4).distinct().count()', '3', 'line 11', {}, {})
test('r.expr([1,2,3]).sample(-1)', "err('ReqlQueryLogicError', 'Number of items to sample must be non-negative, got `-1`.', [0])", 'line 15', {}, {})
test('r.expr(1).sample(1)', "err('ReqlQueryLogicError', 'Cannot convert NUMBER to SEQUENCE', [0])", 'line 17', {}, {})
test('r.expr({}).sample(1)', "err('ReqlQueryLogicError', 'Cannot convert OBJECT to SEQUENCE', [0])", 'line 19', {}, {})
define('Number.MAX_VALUE', 'floatMax')
define('Number.MIN_VALUE', 'floatMin')
define('Math.pow(2,53) - 1', 'upperLimit')
define('1 - Math.pow(2,53)', 'lowerLimit')
test('r.random(10, 20).do(function(x){return r.and(x.ge(10), x.lt(20))})', 'true', 'line 114', {}, {})
test('r.random(9347849, 120937493).do(function(x){return r.and(x.ge(9347849), x.lt(120937493))})', 'true', 'line 115', {}, {})
test('r.random(-10, 20).do(function(x){return r.and(x.ge(-10), x.lt(20))})', 'true', 'line 127', {}, {})
test('r.random(-20, -10).do(function(x){return r.and(x.ge(-20), x.lt(-10))})', 'true', 'line 128', {}, {})
test('r.random(-120937493, -9347849).do(function(x){return r.and(x.ge(-120937493), x.lt(-9347849))})', 'true', 'line 129', {}, {})
test('r.expr([r.random(upperLimit), r.random(upperLimit)]).distinct().count()', '2', 'line 137', {}, {})
test('r.expr([upperLimit,upperLimit]).map(function(x){return r.random(x)}).distinct().count()', '2', 'line 140', {}, {})
test('r.random(-0.5)', 'err("ReqlQueryLogicError", "Upper bound (-0.5) could not be safely converted to an integer.", [])', 'line 147', {}, {})
test('r.random(0.25)', 'err("ReqlQueryLogicError", "Upper bound (0.25) could not be safely converted to an integer.", [])', 'line 149', {}, {})
test('r.random(-10, 0.75)', 'err("ReqlQueryLogicError", "Upper bound (0.75) could not be safely converted to an integer.", [])', 'line 151', {}, {})
test('r.random(-120549.25, 39458)', 'err("ReqlQueryLogicError", "Lower bound (-120549.25) could not be safely converted to an integer.", [])', 'line 153', {}, {})
test('r.random(-6.5, 8.125)', 'err("ReqlQueryLogicError", "Lower bound (-6.5) could not be safely converted to an integer.", [])', 'line 155', {}, {})
test('r.random({float:false})', 'err("ReqlQueryLogicError", "Generating a random integer requires one or two bounds.", [])', 'line 160', {}, {})
test('r.random(0)', 'err("ReqlQueryLogicError", "Lower bound (0) is not less than upper bound (0).", [])', 'line 165', {}, {})
test('r.random(0, 0)', 'err("ReqlQueryLogicError", "Lower bound (0) is not less than upper bound (0).", [])', 'line 167', {}, {})
test('r.random(515, 515)', 'err("ReqlQueryLogicError", "Lower bound (515) is not less than upper bound (515).", [])', 'line 169', {}, {})
test('r.random(-956, -956)', 'err("ReqlQueryLogicError", "Lower bound (-956) is not less than upper bound (-956).", [])', 'line 171', {}, {})
test('r.random(-10)', 'err("ReqlQueryLogicError", "Lower bound (0) is not less than upper bound (-10).", [])', 'line 173', {}, {})
test('r.random(20, 2)', 'err("ReqlQueryLogicError", "Lower bound (20) is not less than upper bound (2).", [])', 'line 175', {}, {})
test('r.random(2, -20)', 'err("ReqlQueryLogicError", "Lower bound (2) is not less than upper bound (-20).", [])', 'line 177', {}, {})
test('r.random(1456, 0)', 'err("ReqlQueryLogicError", "Lower bound (1456) is not less than upper bound (0).", [])', 'line 179', {}, {})

the_end()
