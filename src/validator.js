'use strict'

/* eslint-env node, es6 */

const _ = require('./util')

exports.entry = inventory => entry => {
  if (!_.isNonEmptyObject(entry)) {
    inventory.emit('error', new Error('entry should be a non-empty object'))
    return false
  }
  if (!_.isNonNegativeNumber(entry.incoming)) {
    inventory.emit('error', new Error('entry.incoming should be a non-negative number'))
    return false
  }
  if (!_.isNonNegativeNumber(entry.outgoing)) {
    inventory.emit('error', new Error('entry.outgoing should be a non-negative number'))
    return false
  }
  if (!_.isPositiveNumber(entry.shelfLife)) {
    inventory.emit('error', new Error('entry.shelfLife should be a positive number'))
    return false
  }
  return true
}

exports.entries = (inventory, validEntry) => entries => {
  if (!_.isNonEmptyArray(entries)) {
    inventory.emit('error', new Error('entries should be a non-empty array'))
    return false
  }
  for (let i = 0; i < entries.length; i++) {
    if (!validEntry(entries[i])) return false
  }
  return true
}

exports.index = (inventory, numEntries) => index => {
  if (!_.isNonNegativeNumber(index)) {
    inventory.emit('error', new Error('index should be a non-negative number'))
    return false
  }
  if (numEntries > 0 && index > numEntries) {
    inventory.emit('error', new Error('index is out of range'))
    return false
  }
  return true
}

exports.range = (inventory, numEntries) => (start, end) => {
  if (!_.isNonNegativeNumber(start)) {
    inventory.emit('error', new Error('start should be a non-negative number'))
    return false
  }
  if (!_.isPositiveNumber(end)) {
    inventory.emit('error', new Error('end should be a positive number'))
    return false
  }
  if (numEntries > 0 && end > numEntries) {
    inventory.emit('error', new Error('end is out of range'))
    return false
  }
  if (start >= end) {
    inventory.emit('error', new Error('end should be greater than start'))
    return false
  }
  return true
}
