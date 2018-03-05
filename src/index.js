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

module.exports = (size) => {
  const inventory = new EventEmitter()
  const on = (eventName, cb) => {
    inventory.on(eventName, (...args) => setImmediate(cb, ...args))
  }
  const available = new Array(size)
  const entries = new Array(size).fill(null).map((_, i) => newEntry(i))
  const future = new Array(size)
  const prev = new Array(size)
  let i, j, v
  const calcAvailable = (len) => {
    future.fill(0)
    prev.fill(0)
    for (i = 1; i < len; i++) {
      v = 0
      for (j = i - 1; j >= 0 && entries[j].end > i; j--) {
        if (entries[j].incoming >= entries[j].outgoing && prev[j] >= entries[j].incoming) {
          prev[i] += Math.max(0, entries[j].incoming - v)
        } else {
          prev[i] += Math.max(0, prev[j] - entries[j].outgoing + entries[j].incoming - v)
        }
        v += entries[j].outgoing
      }
    }
    for (i = len - 2; i >= 0; i--) {
      if (prev[i] - entries[i].outgoing + entries[i].incoming > 0) {
        for (j = i + 1; j < len && entries[i].end > j; j++) {
          future[i] += Math.min(0, future[j] - entries[j].outgoing + entries[j].incoming)
        }
      }
    }
    for (i = 0; i < len; i++) {
      available[i] = entries[i].incoming - entries[i].outgoing + prev[i] + future[i]
    }
  }
  const update = ({index, incoming, outgoing, shelfLife}) => {
    const entry = entries[index]
    if (!_.isNegativeNumber(incoming)) {
      entry.incoming = incoming
    }
    if (!_.isNegativeNumber(outgoing)) {
      entry.outgoing = outgoing
    }
    if (_.isPositiveNumber(shelfLife)) {
      entry.end = entry.start + shelfLife
    }
  }
  on('update', (entry) => {
    update(entry)
    inventory.emit('updated')
  })
  on('updates', (updates) => {
    updates.forEach(update)
    inventory.emit('updated')
  })
  on('getAvailable', (len) => {
    calcAvailable(len)
    inventory.emit('gotAvailable', available.slice(0, len))
  })
  on('getEntries', () => {
    inventory.emit('gotEntries', entries.slice(0))
  })
  return inventory
}
