'use strict'

/* eslint-env node, es6 */

const _ = require('./util')
const EventEmitter = require('events')

const newEntry = (index) => {
  return {
    'start': index,
    'end': index,
    'incoming': 0,
    'outgoing': 0
  }
}

/**
 * newInventory
 * @param  {number} numEntries
 * @return {EventEmitter} inventory
 */

const newInventory = (numEntries) => {
  if (!_.isPositiveNumber(numEntries)) {
    throw new Error('numEntries should be a positive number')
  }
  const inventory = new EventEmitter()
  const on = (eventName, cb) => {
    inventory.on(eventName, (...args) => setImmediate(cb, ...args))
  }
  const available = new Array(numEntries)
  const entries = new Array(numEntries).fill(null).map((_, i) => newEntry(i))
  const future = new Array(numEntries)
  const prev = new Array(numEntries)
  let i, j, v
  const numAvailable = (i) => {
    return entries[i].incoming - entries[i].outgoing + prev[i] + future[i]
  }
  const calcAvailable = (start, end) => {
    future.fill(0)
    prev.fill(0)
    for (i = start; i < end; i++) {
      v = 0
      for (j = i - 1; j >= start - 1 && entries[j].end > i; j--) {
        if (entries[j].incoming >= entries[j].outgoing && prev[j] >= entries[j].incoming) {
          prev[i] += Math.max(0, entries[j].incoming - v)
        } else {
          prev[i] += Math.max(0, prev[j] - entries[j].outgoing + entries[j].incoming - v)
        }
        v += entries[j].outgoing
      }
    }
    for (i = end - 2; i >= start - 1; i--) {
      if (prev[i] - entries[i].outgoing + entries[i].incoming > 0) {
        for (j = i + 1; j < end && numAvailable(i) > 0 && entries[i].end > j; j++) {
          future[i] += Math.min(0, future[j] - entries[j].outgoing + entries[j].incoming)
          if (entries[j].incoming + prev[j] < entries[j].outgoing) {
            future[i] += prev[j]
          }
        }
      }
    }
    for (i = start - 1; i < end; i++) {
      available[i] = numAvailable(i)
    }
  }
  const update = ({index, incoming, outgoing, shelfLife}) => {
    if (!_.isNonNegativeNumber(incoming)) {
      inventory.emit('error', new Error('incoming should be a non-negative number'))
      return false
    }
    if (!_.isNonNegativeNumber(outgoing)) {
      inventory.emit('error', new Error('outgoing should be a non-negative number'))
      return false
    }
    if (!_.isPositiveNumber(shelfLife)) {
      inventory.emit('error', new Error('shelfLife should be a positive number'))
      return false
    }
    const entry = entries[index]
    entry.incoming = incoming
    entry.outgoing = outgoing
    entry.end = entry.start + shelfLife
    return true
  }
  const updates = (entries) => {
    if (!_.isNotEmptyArray(entries)) {
      return inventory.emit('error', new Error('entries should be a non-empty array'))
    }
    for (let i = 0; i < entries.length; i++) {
      if (!update(entries[i])) return
    }
    inventory.emit('updated')
  }
  on('update', (entry) => {
    if (update(entry)) inventory.emit('updated')
  })
  on('updates', updates)
  on('getAvailable', (start, end) => {
    if (!_.isPositiveNumber(start)) {
      return inventory.emit('error', new Error('start should be a positive number'))
    }
    if (!_.isPositiveNumber(end)) {
      return inventory.emit('error', new Error('end should be a positive number'))
    }
    if (end > numEntries) {
      return inventory.emit('error', new Error('end is out of range'))
    }
    if (end <= start) {
      return inventory.emit('error', new Error('end should be greater than start'))
    }
    calcAvailable(start, end)
    inventory.emit('gotAvailable', available.slice(start - 1, end))
  })
  on('getEntries', () => {
    inventory.emit('gotEntries', entries.slice(0))
  })
  return inventory
}

module.exports = newInventory
