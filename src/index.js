'use strict'

/* eslint-env node, es6 */

const available = require('./available')
const {convertEntry, newEntry, fillMissingEntries} = require('./entry')
const EventEmitter = require('events')
const {MongoClient} = require('mongodb')
const {Client} = require('pg')
const validator = require('./validator')
const _ = require('./util')

/**
 * newInventory
 * @param  {number} numEntries
 * @return {EventEmitter}
 */

exports.newInventory = numEntries => {
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
  const getEntry = index => {
    if (!validIndex(index)) return
    inventory.emit('gotEntry', entries[index])
  }
  const getEntries = (start, end) => {
    if (!validRange(start, end)) return
    inventory.emit('gotEntries', entries.slice(start, end))
  }
  const doUpdate = entry => {
    const index = entry.index
    entries[index].incoming = entry.incoming
    entries[index].outgoing = entry.outgoing
    entries[index].expires = index + entry.shelfLife
  }
  const updateEntry = entry => {
    if (!validEntry(entry)) return
    doUpdate(entry)
    inventory.emit('updatedEntry')
  }
  const updateEntries = entries => {
    if (!validEntries(entries)) return
    _.each(entries, doUpdate)
    inventory.emit('updatedEntries')
  }
  on('getAvailable', getAvailable)
  on('getEntry', getEntry)
  on('getEntries', getEntries)
  on('updateEntry', updateEntry)
  on('updateEntries', updateEntries)
  return inventory
}

const postgresql = (opts, inventory) => {
  const client = new Client({
    database: opts.name,
    host: opts.host,
    port: opts.port
  })
  client.connect(err => {
    if (err) return inventory.emit('error', err)
    const on = (eventName, cb) => {
      inventory.on(eventName, (...args) => setImmediate(cb, ...args))
    }
    const once = (eventName, cb) => {
      inventory.once(eventName, (...args) => setImmediate(cb, ...args))
    }
    const validEntry = validator.entry(inventory)
    const validEntries = validator.entries(inventory, validEntry)
    const validIndex = validator.index(inventory, opts.numEntries)
    const validRange = validator.range(inventory, opts.numEntries)
    const getAvailable = (start, end) => {
      once('gotEntries', entries => inventory.emit('gotAvailable', available(entries)))
      inventory.emit('getEntries', start, end)
    }
    const getEntry = index => {
      if (!validIndex(index)) return
      client.query(`
        SELECT index, expires, incoming, outgoing FROM entries
        WHERE  index = ${index}`,
      (err, res) => {
        if (err) return inventory.emit('error', err)
        const entry = res.rows[0]
        inventory.emit('gotEntry', entry)
      })
    }
    const getEntries = (start, end) => {
      if (!validRange(start, end)) return
      client.query(`
        SELECT index, expires, incoming, outgoing FROM entries
        WHERE index >= ${start} AND index < ${end}
        ORDER BY index`,
      (err, res) => {
        if (err) return inventory.emit('error', err)
        const entries = fillMissingEntries(res.rows, start, end)
        inventory.emit('gotEntries', entries)
      })
    }
    const updateEntry = entry => {
      if (!validEntry(entry)) return
      const expires = entry.index + entry.shelfLife
      client.query(`
        INSERT INTO entries(index, expires, incoming, outgoing)
        VALUES(${entry.index}, ${expires}, ${entry.incoming}, ${entry.outgoing})
        ON CONFLICT (index)
        DO UPDATE SET expires = ${expires}, incoming = ${entry.incoming}, outgoing = ${entry.outgoing}`,
      err => {
        if (err) return inventory.emit('error', err)
        inventory.emit('updatedEntry')
      })
    }
    const updateEntries = entries => {
      if (!validEntries(entries)) return
      const values = _.join(_.map(entries, entry => `(${entry.index}, ${entry.index + entry.shelfLife}, ${entry.incoming}, ${entry.outgoing})`), ',')
      client.query(`
        INSERT INTO entries(index, expires, incoming, outgoing)
        VALUES${values}
        ON CONFLICT (index)
        DO UPDATE SET expires = entries.expires, incoming = entries.incoming, outgoing = entries.outgoing`,
      err => {
        if (err) return inventory.emit('error', err)
        inventory.emit('updatedEntries')
      })
    }
    on('getAvailable', getAvailable)
    on('getEntry', getEntry)
    on('getEntries', getEntries)
    on('updateEntry', updateEntry)
    on('updateEntries', updateEntries)
    client.query(`
      DROP TABLE IF EXISTS entries CASCADE;
      CREATE TABLE entries (
        "id" bigserial PRIMARY KEY,
        "index" INT UNIQUE,
        "expires" INT,
        "incoming" INT,
        "outgoing" INT
      );`,
    err => {
      if (err) return inventory.emit('error', err)
      inventory.emit('started')
    })
  })
}

const mongodb = (opts, inventory) => {
  const url = `mongodb://${opts.host}:${opts.port}`
  MongoClient.connect(url, (err, client) => {
    if (err) return inventory.emit('error', err)
    const on = (eventName, cb) => {
      inventory.on(eventName, (...args) => setImmediate(cb, ...args))
    }
    const once = (eventName, cb) => {
      inventory.once(eventName, (...args) => setImmediate(cb, ...args))
    }
    const collection = client.db(opts.name).collection('entries')
    const validEntry = validator.entry(inventory)
    const validEntries = validator.entries(inventory, validEntry)
    const validIndex = validator.index(inventory, opts.numEntries)
    const validRange = validator.range(inventory, opts.numEntries)
    const getAvailable = (start, end) => {
      once('gotEntries', entries => inventory.emit('gotAvailable', available(entries)))
      inventory.emit('getEntries', start, end)
    }
    const getEntry = index => {
      if (!validIndex(index)) return
      collection.findOne({index}, (err, entry) => {
        if (err) return inventory.emit('error', err)
        inventory.emit('gotEntry', entry)
      })
    }
    const getEntries = (start, end) => {
      if (!validRange(start, end)) return
      collection.find({index: {$gte: start, $lt: end}}, (err, cursor) => {
        if (err) return inventory.emit('error', err)
        cursor.sort({index: 1})
        cursor.toArray((err, entries) => {
          if (err) return inventory.emit('error', err)
          const allEntries = fillMissingEntries(entries, start, end)
          inventory.emit('gotEntries', allEntries)
        })
      })
    }
    const updateEntry = entry => {
      if (!validEntry(entry)) return
      collection.updateOne({index: entry.index}, {$set: convertEntry(entry)}, {upsert: true}, err => {
        if (err) return inventory.emit('error', err)
        inventory.emit('updatedEntry')
      })
    }
    const updateEntries = entries => {
      if (!validEntries(entries)) return
      const writes = _.map(entries, entry => {
        return {updateOne: {filter: {index: entry.index}, update: {$set: convertEntry(entry)}, upsert: true}}
      })
      collection.bulkWrite(writes, err => {
        if (err) return inventory.emit('error', err)
        inventory.emit('updatedEntries')
      })
    }
    on('getAvailable', getAvailable)
    on('getEntry', getEntry)
    on('getEntries', getEntries)
    on('updateEntry', updateEntry)
    on('updateEntries', updateEntries)
    collection.deleteMany({}, err => {
      if (err) return inventory.emit('error', err)
      inventory.emit('started')
    })
  })
}

/**
 * newInventoryDB
 * @param  {Object} opts
 * @return {EventEmitter}
 */

exports.newInventoryDB = opts => {
  if (!_.isNonEmptyObject(opts)) {
    throw new Error('opts should be a non-empty object')
  }
  if (!_.isNonEmptyString(opts.db)) {
    throw new Error('opts.db should be a non-empty string')
  }
  if (!_.isNonEmptyString(opts.name)) {
    throw new Error('opts.name should be a non-empty string')
  }
  if (!_.isNonEmptyString(opts.host)) {
    throw new Error('opts.host should be a non-empty string')
  }
  if (!_.isNumber(opts.port) || opts.port <= 1023) {
    throw new Error('opts.port should be a number > 1023')
  }
  opts.numEntries = opts.numEntries || 0
  if (!_.isNonNegativeNumber(opts.numEntries)) {
    throw new Error('opts.numEntries should be a non-negative number')
  }
  const inventory = new EventEmitter()
  if (opts.db === 'mongodb') {
    mongodb(opts, inventory)
  } else if (opts.db === 'postgresql') {
    postgresql(opts, inventory)
  } else {
    throw new Error('opts.db should be "mongodb" or "postgresql"')
  }
  return inventory
}
