'use strict'

/* eslint-env node, es6 */

const _ = require('./util')

exports.date = emitter => (eventName, date) => {
  if (!_.isNonNegativeNumber(date)) {
    emitter.emit(eventName, new Error('date should be a non-negative number'))
    return false
  }
  return true
}

exports.entry = emitter => (eventName, entry) => {
  if (!_.isNonEmptyObject(entry)) {
    emitter.emit(eventName, new Error('entry should be a non-empty object'))
    return false
  }
  if (!_.isNonNegativeNumber(entry.date)) {
    emitter.emit(eventName, new Error('entry.date should be a non-negative number'))
    return false
  }
  if (!_.isNonNegativeNumber(entry.incoming)) {
    emitter.emit(eventName, new Error('entry.incoming should be a non-negative number'))
    return false
  }
  if (!_.isNonNegativeNumber(entry.outgoing)) {
    emitter.emit(eventName, new Error('entry.outgoing should be a non-negative number'))
    return false
  }
  if (!_.isPositiveNumber(entry.shelflife)) {
    emitter.emit(eventName, new Error('entry.shelflife should be a positive number'))
    return false
  }
  return true
}

exports.entries = (emitter, validEntry) => (eventName, entries) => {
  if (!_.isNonEmptyArray(entries)) {
    emitter.emit(eventName, new Error('entries should be a non-empty array'))
    return false
  }
  for (let i = 0; i < entries.length; i++) {
    if (!validEntry(eventName, entries[i])) return false
  }
  return true
}

exports.range = emitter => (eventName, begin, end) => {
  if (!_.isNonNegativeNumber(begin)) {
    emitter.emit(eventName, new Error('begin should be a non-negative number'))
    return false
  }
  if (!_.isPositiveNumber(end)) {
    emitter.emit(eventName, new Error('end should be a positive number'))
    return false
  }
  if (begin >= end) {
    emitter.emit(eventName, new Error('end should be greater than begin'))
    return false
  }
  return true
}
