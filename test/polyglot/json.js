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

test('r.json("[1,2,3]")', '[1,2,3]', 'line 4', {}, {})
test('r.json("1")', '1', 'line 7', {}, {})
test('r.json("{}")', '({})', 'line 10', {}, {})
test('r.json(\'"foo"\')', '"foo"', 'line 13', {}, {})
test('r.json("[1,2")', 'err("ReqlQueryLogicError", \'Failed to parse "[1,2" as JSON:\' + \' Missing a comma or \\\']\\\' after an array element.\', [0])', 'line 16', {}, {})
test('r.json("[1,2,3]").toJsonString()', "'[1,2,3]'", 'line 19', {}, {})
test('r.json("[1,2,3]").toJSON()', "'[1,2,3]'", 'line 22', {}, {})
test('r.json("{\\"foo\\":4}").toJsonString()', '\'{"foo":4}\'', 'line 26', {}, {})
test('r.json("{\\"foo\\":4}").toJSON()', '\'{"foo":4}\'', 'line 29', {}, {})
define('\'[{"id":1,"first_name":"Harry","last_name":"Riley","email":"hriley0@usgs.gov","country":"Andorra","ip_address":"221.25.65.136"},{"id":2,"first_name":"Bonnie","last_name":"Anderson","email":"banderson1@list-manage.com","country":"Tuvalu","ip_address":"116.162.43.150"},{"id":3,"first_name":"Marie","last_name":"Schmidt","email":"mschmidt2@diigo.com","country":"Iraq","ip_address":"181.105.59.57"},{"id":4,"first_name":"Phillip","last_name":"Willis","email":"pwillis3@com.com","country":"Montenegro","ip_address":"24.223.139.156"}]\'', 'text')
define('\'[{"country":"Andorra","email":"hriley0@usgs.gov","first_name":"Harry","id":1,"ip_address":"221.25.65.136","last_name":"Riley"},{"country":"Tuvalu","email":"banderson1@list-manage.com","first_name":"Bonnie","id":2,"ip_address":"116.162.43.150","last_name":"Anderson"},{"country":"Iraq","email":"mschmidt2@diigo.com","first_name":"Marie","id":3,"ip_address":"181.105.59.57","last_name":"Schmidt"},{"country":"Montenegro","email":"pwillis3@com.com","first_name":"Phillip","id":4,"ip_address":"24.223.139.156","last_name":"Willis"}]\'', 'sorted')
test('r.json(text).toJsonString()', 'sorted', 'line 37', {}, {})
test('r.expr(r.minval).toJsonString()', "err('ReqlQueryLogicError', 'Cannot convert `r.minval` to JSON.')", 'line 40', {}, {})
test('r.expr(r.maxval).toJsonString()', "err('ReqlQueryLogicError', 'Cannot convert `r.maxval` to JSON.')", 'line 43', {}, {})
test("r.expr(r.minval).coerceTo('string')", "err('ReqlQueryLogicError', 'Cannot convert `r.minval` to JSON.')", 'line 46', {}, {})
test("r.expr(r.maxval).coerceTo('string')", "err('ReqlQueryLogicError', 'Cannot convert `r.maxval` to JSON.')", 'line 49', {}, {})
test("r.time(2014,9,11, 'Z')", "({'timezone':'+00:00','$reql_type$':'TIME','epoch_time':1410393600})", 'line 52', {'time_format': "'raw'"}, {})
test("r.time(2014,9,11, 'Z').toJsonString()", '\'{"$reql_type$":"TIME","epoch_time":1410393600,"timezone":"+00:00"}\'', 'line 57', {}, {})
test('r.point(0,0)', "({'$reql_type$':'GEOMETRY','coordinates':[0,0],'type':'Point'})", 'line 60', {}, {})
test('r.point(0,0).toJsonString()', '\'{"$reql_type$":"GEOMETRY","coordinates":[0,0],"type":"Point"}\'', 'line 63', {}, {})
define('Buffer("\\x66\\x6f\\x6f", \'binary\')', 's')
test('r.binary(s)', 's', 'line 70', {}, {})
test('r.expr("foo").coerceTo("binary").toJsonString()', '\'{"$reql_type$":"BINARY","data":"Zm9v"}\'', 'line 73', {}, {})

the_end()
