'use strict'

/* eslint-env node, es6 */

const _ = require('lodash')

const on = (emitter, eventName, cb) => {
  emitter.on(eventName, (...args) => setImmediate(cb, ...args))
}

const once = (emitter, eventName, cb) => {
  emitter.once(eventName, (...args) => setImmediate(cb, ...args))
}

_.mixin({
  isNonEmptyArray: arr => _.isArray(arr) && !_.isEmpty(arr),
  isNonEmptyObject: obj => _.isPlainObject(obj) && !_.isEmpty(obj),
  isNonEmptyString: str => _.isString(str) && !_.isEmpty(str),
  isNonNegativeNumber: num => _.isNumber(num) && num >= 0,
  isPositiveNumber: num => _.isNumber(num) && num > 0
})

module.exports = {_, on, once}
