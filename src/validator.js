'use strict'

/* eslint-env node, es6 */

const {_} = require('./util')

exports.date = (emitter, numEntries) => date => {
  if (!_.isNonNegativeNumber(date)) {
    emitter.emit('error', new Error('date should be a non-negative number'))
    return false
  }
  if (numEntries > 0 && date > numEntries) {
    emitter.emit('error', new Error('date is out of range'))
    return false
  }
  return true
}

exports.entry = emitter => entry => {
  if (!_.isNonEmptyObject(entry)) {
    emitter.emit('error', new Error('entry should be a non-empty object'))
    return false
  }
  if (!_.isNonNegativeNumber(entry.date)) {
    emitter.emit('error', new Error('entry.date should be a non-negative number'))
    return false
  }
  if (!_.isNonNegativeNumber(entry.incoming)) {
    emitter.emit('error', new Error('entry.incoming should be a non-negative number'))
    return false
  }
  if (!_.isNonNegativeNumber(entry.outgoing)) {
    emitter.emit('error', new Error('entry.outgoing should be a non-negative number'))
    return false
  }
  if (!_.isPositiveNumber(entry.shelflife)) {
    emitter.emit('error', new Error('entry.shelflife should be a positive number'))
    return false
  }
  return true
}

exports.entries = (emitter, validEntry) => entries => {
  if (!_.isNonEmptyArray(entries)) {
    emitter.emit('error', new Error('entries should be a non-empty array'))
    return false
  }
  for (let i = 0; i < entries.length; i++) {
    if (!validEntry(entries[i])) return false
  }
  return true
}

exports.range = (emitter, numEntries) => (start, end) => {
  if (!_.isNonNegativeNumber(start)) {
    emitter.emit('error', new Error('start should be a non-negative number'))
    return false
  }
  if (!_.isPositiveNumber(end)) {
    emitter.emit('error', new Error('end should be a positive number'))
    return false
  }
  if (numEntries > 0 && end > numEntries) {
    emitter.emit('error', new Error('end is out of range'))
    return false
  }
  if (start >= end) {
    emitter.emit('error', new Error('end should be greater than start'))
    return false
  }
  return true
}
