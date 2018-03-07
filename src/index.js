'use strict'

/* eslint-env node, es6 */

const _ = require('./util')
const {convertEntry, newEntry} = require('./entry')
const EventEmitter = require('events')
const {MongoClient} = require('mongodb')
const validator = require('./validator')

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
  const numAvailable = (i) => {
    return entries[i].incoming - entries[i].outgoing + prev[i] + future[i]
  }
  const validEntry = validator.entry(inventory)
  const validEntries = validator.entries(inventory, validEntry)
  const validRange = validator.range(inventory, numEntries)
  const getEntries = (min, max) => {
    if (!validRange(min, max)) return
    inventory.emit('gotEntries', entries.slice(min, max))
  }
  let i, j, v
  const getAvailable = (start, end) => {
    if (!validRange(start, end)) return
    future.fill(0)
    prev.fill(0)
    for (i = start + 1; i < end; i++) {
      v = 0
      for (j = i - 1; j >= start && entries[j].end > i; j--) {
        if (entries[j].incoming >= entries[j].outgoing && prev[j] >= entries[j].incoming) {
          prev[i] += Math.max(0, entries[j].incoming - v)
        } else {
          prev[i] += Math.max(0, prev[j] - entries[j].outgoing + entries[j].incoming - v)
        }
        v += entries[j].outgoing
      }
    }
    for (i = end - 2; i >= start; i--) {
      if (prev[i] - entries[i].outgoing + entries[i].incoming > 0) {
        for (j = i + 1; j < end && numAvailable(i) > 0 && entries[i].end > j; j++) {
          future[i] += Math.min(0, future[j] - entries[j].outgoing + entries[j].incoming)
          if (entries[j].incoming + prev[j] < entries[j].outgoing) {
            future[i] += prev[j]
          }
        }
      }
    }
    for (i = start; i < end; i++) {
      available[i] = numAvailable(i)
    }
    inventory.emit('gotAvailable', available.slice(start, end))
  }
  const doUpdate = (entry) => {
    const index = entry.index
    entries[index].incoming = entry.incoming
    entries[index].outgoing = entry.outgoing
    entries[index].end = index + entry.shelfLife
  }
  const update = (entry) => {
    if (!validEntry(entry)) return
    doUpdate(entry)
    inventory.emit('updated')
  }
  const updates = (entries) => {
    if (!validEntries(entries)) return
    entries.forEach(doUpdate)
    inventory.emit('updated')
  }
  on('getAvailable', getAvailable)
  on('getEntries', getEntries)
  on('update', update)
  on('updates', updates)
  return inventory
}

/**
 * newInventoryDB
 * @param  {Object} opts
 * @return {EventEmitter}
 */

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
    if (err) return inventory.emit('error', err)
    const collection = client.db(opts.name).collection('inventory')
    const validEntry = validator.entry(inventory)
    const validEntries = validator.entries(inventory, validEntry)
    const validRange = validator.range(inventory)
    const update = (entry) => {
      if (!validEntry(entry)) return
      collection.updateOne({start: entry.index}, {$set: convertEntry(entry)}, {upsert: true}, (err) => {
        if (err) return inventory.emit('error', err)
        inventory.emit('updated')
      })
    }
    const updates = (entries) => {
      if (!validEntries(entries)) return
      const writes = entries.map((entry) => {
        return {updateOne: {filter: {start: entry.index}, update: {$set: convertEntry(entry)}, upsert: true}}
      })
      collection.bulkWrite(writes, (err) => {
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
      if (!validRange(min, max)) return
      collection.find({start: {$gte: min, $lt: max}}, (err, cursor) => {
        if (err) return inventory.emit('error', err)
        cursor.toArray((err, entries) => {
          if (err) return inventory.emit('error', err)
          inventory.emit('gotEntries', entries)
        })
      })
    }
    on('getEntry', getEntry)
    on('getEntries', getEntries)
    on('update', update)
    on('updates', updates)
    collection.deleteMany({}, (err) => {
      if (err) return inventory.emit('error', err)
      inventory.emit('started')
    })
  })
  return inventory
}
