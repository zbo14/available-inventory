'use strict'

/* eslint-env node, es6 */

const _ = require('lodash')

_.mixin({
  'isNotEmptyArray': (arr) => _.isArray(arr) && !_.isEmpty(arr),
  'isNotEmptyObject': (obj) => _.isPlainObject(obj) && !_.isEmpty(obj),
  'isPositiveNumber': (num) => _.isNumber(num) && num > 0,
  'isNonNegativeNumber': (num) => _.isNumber(num) && num >= 0
})

module.exports = _
