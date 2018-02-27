'use strict'

/* eslint-env node, es6 */

const _ = require('lodash')

_.mixin({
  'isNotEmptyArray': (arr) => _.isArray(arr) && !_.isEmpty(arr),
  'isPositiveNumber': (num) => _.isNumber(num) && num > 0
})

module.exports = _