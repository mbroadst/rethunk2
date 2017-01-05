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

test('r(1).lt(2)', 'true', 'line 8', {}, {})
test('r(3).lt(2)', 'false', 'line 18', {}, {})
test('r(2).lt(2)', 'false', 'line 23', {}, {})
test('r(1).lt(2, 3, 4)', 'true', 'line 29', {}, {})
test('r(1).lt(2, 3, 2)', 'false', 'line 31', {}, {})
test('r(1).gt(2)', 'false', 'line 36', {}, {})
test('r(3).gt(2)', 'true', 'line 46', {}, {})
test('r(2).gt(2)', 'false', 'line 50', {}, {})
test('r(4).gt(3, 2, 1)', 'true', 'line 54', {}, {})
test('r(4).gt(3, 2, 3)', 'false', 'line 56', {}, {})
test('r(1).eq(2)', 'false', 'line 61', {}, {})
test('r(3).eq(2)', 'false', 'line 69', {}, {})
test('r(2).eq(2)', 'true', 'line 73', {}, {})
test('r(1).eq(1, 1, 1)', 'true', 'line 77', {}, {})
test('r(1).eq(1, 2, 1)', 'false', 'line 79', {}, {})
test('r(1).ne(2)', 'true', 'line 84', {}, {})
test('r(3).ne(2)', 'true', 'line 92', {}, {})
test('r(2).ne(2)', 'false', 'line 96', {}, {})
test('r(1).ne(3, 2, 4)', 'true', 'line 100', {}, {})
test('r(1).ne(3, 2, 3)', 'true', 'line 102', {}, {})
test('r(1).le(2)', 'true', 'line 107', {}, {})
test('r(3).le(2)', 'false', 'line 117', {}, {})
test('r(2).le(2)', 'true', 'line 121', {}, {})
test('r(1).le(1, 2, 2)', 'true', 'line 125', {}, {})
test('r(1).le(1, 3, 2)', 'false', 'line 127', {}, {})
test('r(1).ge(2)', 'false', 'line 132', {}, {})
test('r(3).ge(2)', 'true', 'line 142', {}, {})
test('r(2).ge(2)', 'true', 'line 146', {}, {})
test('r(4).ge(4, 2, 2)', 'true', 'line 150', {}, {})
test('r(4).ge(4, 2, 3)', 'false', 'line 152', {}, {})
test('r(null).eq(null)', 'true', 'line 156', {}, {})
test('r(null).lt(null)', 'false', 'line 162', {}, {})
test('r(null).gt(null)', 'false', 'line 170', {}, {})
test("r('a').eq('a')", 'true', 'line 181', {}, {})
test("r('a').eq('aa')", 'false', 'line 185', {}, {})
test("r('a').lt('aa')", 'true', 'line 189', {}, {})
test("r('a').lt('bb')", 'true', 'line 193', {}, {})
test("r('bb').gt('a')", 'true', 'line 197', {}, {})
test("r('abcdef').lt('abcdeg')", 'true', 'line 201', {}, {})
test("r('abcdefg').gt('abcdeg')", 'false', 'line 205', {}, {})
test("r('A quick brown fox').gt('A quick brawn fox')", 'true', 'line 209', {}, {})
test('r([1]).lt([2])', 'true', 'line 217', {}, {})
test('r([1]).gt([2])', 'false', 'line 222', {}, {})
test('r([1, 0]).lt([2])', 'true', 'line 227', {}, {})
test('r([1, 0]).lt([1])', 'false', 'line 232', {}, {})
test('r([1, 0]).gt([0])', 'true', 'line 237', {}, {})
test("r([1, 'a']).lt([1, 'b'])", 'true', 'line 242', {}, {})
test("r([0, 'z']).lt([1, 'b'])", 'true', 'line 247', {}, {})
test('r([1, 1, 1]).lt([1, 0, 2])', 'false', 'line 252', {}, {})
test('r([1, 0, 2]).lt([1, 1, 1])', 'true', 'line 257', {}, {})
test("r({'a':0}).eq({'a':0})", 'true', 'line 264', {}, {})
test("r({'a':0, 'b':1}).eq({'b':1, 'a':0})", 'true', 'line 268', {}, {})
test("r({'a':0, 'b':1, 'c':2}).eq({'b':1, 'a':0})", 'false', 'line 272', {}, {})
test("r({'a':0, 'b':1}).eq({'b':1, 'a':0, 'c':2})", 'false', 'line 276', {}, {})
test("r({'a':0, 'b':1, 'd':2}).eq({'b':1, 'a':0, 'c':2})", 'false', 'line 280', {}, {})
test("r({'a':0}).lt({'b':0})", 'true', 'line 284', {}, {})
test("r({'a':1}).lt({'b':0})", 'true', 'line 288', {}, {})
test("r({'b':1}).lt({'b':0})", 'false', 'line 292', {}, {})
test("r({'b':1}).lt({'a':0})", 'false', 'line 296', {}, {})
test("r({'a':0, 'b':1, 'c':2}).lt({'a':0, 'b':1, 'c':2})", 'false', 'line 300', {}, {})
test("r({'a':0, 'b':1, 'c':2, 'd':3}).lt({'a':0, 'b':1, 'c':2})", 'false', 'line 304', {}, {})
test("r({'a':0, 'b':1, 'c':2}).lt({'a':0, 'b':1, 'c':2, 'd':3})", 'true', 'line 308', {}, {})
test("r({'a':0, 'c':2}).lt({'a':0, 'b':1, 'c':2})", 'false', 'line 312', {}, {})
test("r({'a':0, 'c':2}).gt({'a':0, 'b':1, 'c':2})", 'true', 'line 316', {}, {})
define('r.expr([[],r.now(),r.binary(Buffer("\\x00")),false,null,-5,{},"a",r.maxval])', 'everything')
test('r.and(r.args(everything.map(r.lt(r.minval, r.row))))', 'true', 'line 335', {}, {})
test('r.or(r.args(everything.map(r.gt(r.minval, r.row))))', 'false', 'line 340', {}, {})
test('r.eq(r.minval, r.minval)', 'true', 'line 345', {}, {})
test('r([]).lt(true)', 'true', 'line 349', {}, {})
test('r([1,2]).lt(false)', 'true', 'line 354', {}, {})
test('r(false).lt([])', 'false', 'line 359', {}, {})
test('r([]).lt(r.binary(Buffer("\\x00")))', 'true', 'line 364', {}, {})
test('r([1,2]).lt(r.binary(Buffer("\\x00")))', 'true', 'line 369', {}, {})
test('r(true).lt(null)', 'true', 'line 374', {}, {})
test('r(null).gt([])', 'true', 'line 379', {}, {})
test('r(null).lt(12)', 'true', 'line 384', {}, {})
test('r(null).lt(-2)', 'true', 'line 389', {}, {})
test('r(-12).lt({})', 'true', 'line 394', {}, {})
test('r(100).lt({a:-12})', 'true', 'line 399', {}, {})
test('r(r.binary(Buffer("\\x00"))).lt(12)', 'false', 'line 404', {}, {})
test('r.binary(Buffer("0x00")).lt(\'abc\')', 'true', 'line 409', {}, {})
test('r.binary(Buffer("0x00")).gt(r.now())', 'false', 'line 414', {}, {})
test('r.now().gt(12)', 'true', 'line 419', {}, {})
test("r.now().gt('abc')", 'false', 'line 423', {}, {})
test("r('abc').gt({a:-12})", 'true', 'line 427', {}, {})
test("r('abc').gt({abc:'abc'})", 'true', 'line 432', {}, {})
test("r('zzz').gt(128)", 'true', 'line 437', {}, {})
test("r('zzz').gt({})", 'true', 'line 442', {}, {})
test("r('zzz').gt(-152)", 'true', 'line 447', {}, {})
test("r('zzz').gt(null)", 'true', 'line 452', {}, {})
test("r('zzz').gt([])", 'true', 'line 457', {}, {})
define('r.expr([r.minval,[],r.now(),r.binary(Buffer("\\x00")),false,null,-5,{},"a"])', 'everything2')
test('r.and(r.args(everything2.map(r.gt(r.maxval, r.row))))', 'true', 'line 466', {}, {})
test('r.or(r.args(everything2.map(r.lt(r.maxval, r.row))))', 'false', 'line 471', {}, {})
test('r.eq(r.maxval, r.maxval)', 'true', 'line 476', {}, {})


the_end()
