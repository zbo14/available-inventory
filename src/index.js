'use strict'

/* eslint-env node, es6 */

const {newEntry} = require('./entry')
const EventEmitter = require('events')
const getAvailable = require('./events/getAvailable')
const getEntry = require('./events/getEntry')
const getEntries = require('./events/getEntries')
const updateEntry = require('./events/updateEntry')
const updateEntries = require('./events/updateEntries')
const {MongoClient} = require('mongodb')
const {Client} = require('pg')
const validator = require('./validator')
const {_} = require('./util')

/**
 * Create a new emitter in memory.
 *
 * @function newInventory
 * @param  {number} numEntries - the number of entries in the inventory.
 * @return {EventEmitter}
 */

exports.newInventory = numEntries => {
  if (!_.isPositiveNumber(numEntries)) {
    throw new Error('numEntries should be a positive number')
  }
  const emitter = new EventEmitter()
  const entries = new Array(numEntries).fill(null).map((_, i) => newEntry(i))
  const validDate = validator.date(emitter, numEntries)
  const validEntry = validator.entry(emitter)
  const validEntries = validator.entries(emitter, validEntry)
  const validRange = validator.range(emitter, numEntries)
  getAvailable.memory(emitter, entries, validRange)
  getEntry.memory(emitter, entries, validDate)
  getEntries.memory(emitter, entries, validRange)
  updateEntry.memory(emitter, entries, validEntry)
  updateEntries.memory(emitter, entries, validEntries)
  return emitter
}

const mongodb = opts => {
  const emitter = new EventEmitter()
  const url = `mongodb://${opts.host}:${opts.port}`
  MongoClient.connect(url, (err, client) => {
    if (err) return emitter.emit('error', err)
    const collection = client.db('inventory').collection('entries')
    const validDate = validator.date(emitter, opts.numEntries)
    const validEntry = validator.entry(emitter)
    const validEntries = validator.entries(emitter, validEntry)
    const validRange = validator.range(emitter, opts.numEntries)
    getAvailable.db(emitter)
    getEntry.mongodb(emitter, collection, validDate)
    getEntries.mongodb(emitter, collection, validRange)
    updateEntry.mongodb(emitter, collection, validEntry)
    updateEntries.mongodb(emitter, collection, validEntries)
    collection.deleteMany({}, err => {
      if (err) return emitter.emit('error', err)
      emitter.emit('started')
    })
  })
  return emitter
}

const postgresql = opts => {
  const emitter = new EventEmitter()
  const client = new Client({
    database: 'inventory',
    host: opts.host,
    port: opts.port
  })
  client.connect(err => {
    if (err) return emitter.emit('error', err)
    const validDate = validator.date(emitter, opts.numEntries)
    const validEntry = validator.entry(emitter)
    const validEntries = validator.entries(emitter, validEntry)
    const validRange = validator.range(emitter, opts.numEntries)
    getAvailable.db(emitter)
    getEntry.postgresql(emitter, client, validDate)
    getEntries.postgresql(emitter, client, validRange)
    updateEntry.postgresql(emitter, client, validEntry)
    updateEntries.postgresql(emitter, client, validEntries)
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
      if (err) return emitter.emit('error', err)
      emitter.emit('started')
    })
  })
  return emitter
}

/**
 * @typedef {Object} Opts
 * @property {string} db - the type of database (e.g. "mongodb", "postgresql")
 * @property {string} host - the hostname for the database server.
 * @property {number} port - the port for the database server.
 * @property {number} numEntries - the number of entries in the inventory.
 */

/**
 * Create a new emitter with a database client.
 *
 * @function newInventoryDB
 * @param  {Opts} opts - the configuration options for the database client.
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
  if (opts.db === 'mongodb') {
    return mongodb(opts)
  }
  if (opts.db === 'postgresql') {
    return postgresql(opts)
  }
  throw new Error('opts.db is not supported')
}
