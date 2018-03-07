'use strict'

/* eslint-env node, es6 */

const available = require('./available')
const {convertEntry, newEntry} = require('./entry')
const EventEmitter = require('events')
const {MongoClient} = require('mongodb')
const validator = require('./validator')
const _ = require('./util')

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
  const entries = new Array(numEntries).fill(null).map((_, i) => newEntry(i))
  const validEntry = validator.entry(inventory)
  const validEntries = validator.entries(inventory, validEntry)
  const validIndex = validator.index(inventory, numEntries)
  const validRange = validator.range(inventory, numEntries)
  const getAvailable = (start, end) => {
    if (!validRange(start, end)) return
    inventory.emit('gotAvailable', available(entries.slice(start, end)))
  }
  const getEntry = (index) => {
    if (!validIndex(index)) return
    inventory.emit('gotEntry', entries[index])
  }
  const getEntries = (start, end) => {
    if (!validRange(start, end)) return
    inventory.emit('gotEntries', entries.slice(start, end))
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
  on('getEntry', getEntry)
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
    const validIndex = validator.index(inventory)
    const validRange = validator.range(inventory)
    const getAvailable = (start, end) => {
      inventory.once('gotEntries', (entries) => {
        inventory.emit('gotAvailable', available(entries))
      })
      inventory.emit('getEntries', start, end)
    }
    const getEntry = (index) => {
      if (!validIndex(index)) return
      collection.findOne({start: index}, (err, entry) => {
        if (err) return inventory.emit('error', err)
        inventory.emit('gotEntry', entry)
      })
    }
    const getEntries = (start, end) => {
      if (!validRange(start, end)) return
      collection.find({start: {$gte: start, $lt: end}}, (err, cursor) => {
        if (err) return inventory.emit('error', err)
        cursor.toArray((err, entries) => {
          if (err) return inventory.emit('error', err)
          inventory.emit('gotEntries', entries)
        })
      })
    }
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
    on('getAvailable', getAvailable)
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
