'use strict'

/* eslint-env node, es6 */

const _ = require('lodash')

_.mixin({
  'isNonEmptyArray': (arr) => _.isArray(arr) && !_.isEmpty(arr),
  'isNonEmptyObject': (obj) => _.isPlainObject(obj) && !_.isEmpty(obj),
  'isNonEmptyString': (str) => _.isString(str) && !_.isEmpty(str),
  'isNonNegativeNumber': (num) => _.isNumber(num) && num >= 0,
  'isPositiveNumber': (num) => _.isNumber(num) && num > 0
})

module.exports = _
