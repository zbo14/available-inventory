'use strict'

/* eslint-env node, es6 */

const available = require('./available')
const {newEntry, fillMissingEntries} = require('./entry')
const EventEmitter = require('events')
const {MongoClient} = require('mongodb')
const {Client} = require('pg')
const validator = require('./validator')
const _ = require('./util')

/**
 * Create a new inventory in memory.
 *
 * @function newInventory
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
  const validDate = validator.date(inventory, numEntries)
  const validEntry = validator.entry(inventory)
  const validEntries = validator.entries(inventory, validEntry)
  const validRange = validator.range(inventory, numEntries)
  const getAvailable = (start, end) => {
    if (!validRange(start, end)) return
    inventory.emit('gotAvailable', available(entries.slice(start, end)))
  }
  const getEntry = date => {
    if (!validDate(date)) return
    inventory.emit('gotEntry', entries[date])
  }
  const getEntries = (start, end) => {
    if (!validRange(start, end)) return
    inventory.emit('gotEntries', entries.slice(start, end))
  }
  const doUpdate = ({date, incoming, outgoing, shelflife}) => {
    entries[date].incoming = incoming
    entries[date].outgoing = outgoing
    entries[date].shelflife = shelflife
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
    const collection = client.db('inventory').collection('entries')
    const validDate = validator.date(inventory, opts.numEntries)
    const validEntry = validator.entry(inventory)
    const validEntries = validator.entries(inventory, validEntry)
    const validRange = validator.range(inventory, opts.numEntries)
    const getAvailable = (start, end) => {
      once('gotEntries', entries => inventory.emit('gotAvailable', available(entries)))
      inventory.emit('getEntries', start, end)
    }
    const getEntry = date => {
      if (!validDate(date)) return
      collection.findOne({date}, {projection: {_id: 0}}, (err, entry) => {
        if (err) return inventory.emit('error', err)
        inventory.emit('gotEntry', entry)
      })
    }
    const getEntries = (start, end) => {
      if (!validRange(start, end)) return
      collection.find({date: {$gte: start, $lt: end}}, {projection: {_id: 0}}, (err, cursor) => {
        if (err) return inventory.emit('error', err)
        cursor.sort({date: 1})
        cursor.toArray((err, entries) => {
          if (err) return inventory.emit('error', err)
          const allEntries = fillMissingEntries(entries, start, end)
          inventory.emit('gotEntries', allEntries)
        })
      })
    }
    const updateEntry = entry => {
      if (!validEntry(entry)) return
      collection.updateOne({date: entry.date}, {$set: entry}, {upsert: true}, err => {
        if (err) return inventory.emit('error', err)
        inventory.emit('updatedEntry')
      })
    }
    const updateEntries = entries => {
      if (!validEntries(entries)) return
      const writes = _.map(entries, entry => {
        return {updateOne: {filter: {date: entry.date}, update: {$set: entry}, upsert: true}}
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

const postgresql = (opts, inventory) => {
  const client = new Client({
    database: 'inventory',
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
    const validDate = validator.date(inventory, opts.numEntries)
    const validEntry = validator.entry(inventory)
    const validEntries = validator.entries(inventory, validEntry)
    const validRange = validator.range(inventory, opts.numEntries)
    const getAvailable = (start, end) => {
      once('gotEntries', entries => inventory.emit('gotAvailable', available(entries)))
      inventory.emit('getEntries', start, end)
    }
    const getEntry = date => {
      if (!validDate(date)) return
      client.query(`
        SELECT date, incoming, outgoing, shelflife FROM entries
        WHERE date = ${date}`,
      (err, res) => {
        if (err) return inventory.emit('error', err)
        const entry = res.rows[0]
        inventory.emit('gotEntry', entry)
      })
    }
    const getEntries = (start, end) => {
      if (!validRange(start, end)) return
      client.query(`
        SELECT date, incoming, outgoing, shelflife FROM entries
        WHERE date >= ${start} AND date < ${end}
        ORDER BY date`,
      (err, res) => {
        if (err) return inventory.emit('error', err)
        const entries = fillMissingEntries(res.rows, start, end)
        inventory.emit('gotEntries', entries)
      })
    }
    const updateEntry = entry => {
      if (!validEntry(entry)) return
      client.query(`
        INSERT INTO entries(date, incoming, outgoing, shelflife)
        VALUES(${entry.date}, ${entry.incoming}, ${entry.outgoing}, ${entry.shelflife})
        ON CONFLICT (date)
        DO UPDATE SET incoming = ${entry.incoming}, outgoing = ${entry.outgoing}, shelflife = ${entry.shelflife}`,
      err => {
        if (err) return inventory.emit('error', err)
        inventory.emit('updatedEntry')
      })
    }
    const updateEntries = entries => {
      if (!validEntries(entries)) return
      const values = _.join(_.map(entries, entry => `(${entry.date}, ${entry.incoming}, ${entry.outgoing}, ${entry.shelflife})`), ',')
      client.query(`
        INSERT INTO entries(date, incoming, outgoing, shelflife)
        VALUES${values}
        ON CONFLICT (date)
        DO UPDATE SET incoming = entries.incoming, outgoing = entries.outgoing, shelflife = entries.shelflife`,
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
        "date" INT UNIQUE,
        "incoming" INT,
        "outgoing" INT,
        "shelflife" INT
      );`,
    err => {
      if (err) return inventory.emit('error', err)
      inventory.emit('started')
    })
  })
}

/**
 * @typedef {Object} Opts
 * @property {string} db
 * @property {string} host
 * @property {number} port
 * @property {number} numEntries
 */

/**
 * Create a new inventory with a database client.
 *
 * @function newInventoryDB
 * @param  {Opts} opts
 * @return {EventEmitter}
 */

exports.newInventoryDB = opts => {
  if (!_.isNonEmptyObject(opts)) {
    throw new Error('opts should be a non-empty object')
  }
  if (!_.isNonEmptyString(opts.db)) {
    throw new Error('opts.db should be a non-empty string')
  }
  if (!_.isNonEmptyString(opts.host)) {
    throw new Error('opts.host should be a non-empty string')
  }
  if (!_.isNumber(opts.port) || opts.port <= 1023) {
    throw new Error('opts.port should be a number greater than 1023')
  }
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
