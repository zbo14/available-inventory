'use strict'

/* eslint-env node, es6 */

const _ = require('./util')
const EventEmitter = require('events')
const {MongoClient} = require('mongodb')

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
 * @return {EventEmitter}
 */

exports.newInventory = (numEntries) => {
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
    if (!_.isNonEmptyArray(entries)) {
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
  on('getEntries', (start, end) => {
    inventory.emit('gotEntries', entries.slice(start - 1, end))
  })
  return inventory
}

/**
 * newInventoryDB
 * @param  {Object} opts
 * @return {EventEmitter}
 */

const convertEntry = (entry) => {
  return {
    'start': entry.index,
    'end': entry.index + entry.shelfLife,
    'incoming': entry.incoming,
    'outgoing': entry.outgoing
  }
}

exports.newInventoryDB = (opts) => {
  if (!_.isNonEmptyObject(opts)) {
    throw new Error('opts should be a non-empty object')
  }
  if (!_.isNonEmptyString(opts.name)) {
    throw new Error('opts.name should be a non-empty string')
  }
  if (!_.isNonEmptyString(opts.url)) {
    throw new Error('opts.url should be a non-empty string')
  }
  const inventory = new EventEmitter()
  const on = (eventName, cb) => {
    inventory.on(eventName, (...args) => setImmediate(cb, ...args))
  }
  MongoClient.connect(opts.url, (err, client) => {
    if (err) throw err
    const collection = client.db(opts.name).collection('inventory')
    const update = (entry) => {
      collection.update({start: entry.index}, convertEntry(entry), {upsert: true}, (err) => {
        if (err) return inventory.emit('error', err)
        inventory.emit('updated')
      })
    }
    const getEntry = (index) => {
      if (!_.isNonNegativeNumber(index)) {
        return inventory.emit('error', new Error('index should be a non-negative number'))
      }
      collection.findOne({start: index}, (err, entry) => {
        if (err) return inventory.emit('error', err)
        inventory.emit('gotEntry', entry)
      })
    }
    const getEntries = (min, max) => {
      if (!_.isPositiveNumber(min)) {
        return inventory.emit('error', new Error('min should be a positive number'))
      }
      if (!_.isPositiveNumber(max)) {
        return inventory.emit('error', new Error('max should be a positive number'))
      }
      if (min >= max) {
        return inventory.emit('error', new Error('max should be greater than min'))
      }
      collection.find({start: {$gte: min - 1, $lt: max}}, (err, cursor) => {
        if (err) return inventory.emit('error', err)
        cursor.toArray((err, entries) => {
          if (err) return inventory.emit('error', err)
          inventory.emit('gotEntries', entries)
        })
      })
    }
    on('update', update)
    on('getEntry', getEntry)
    // on('updates', updates)
    on('getEntries', getEntries)
    inventory.emit('started')
  })
  return inventory
}
