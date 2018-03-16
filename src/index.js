'use strict'

/* eslint-env node, es6 */

const EventEmitter = require('events')
const getAvailable = require('./events/getAvailable')
const getEntry = require('./events/getEntry')
const getEntries = require('./events/getEntries')
const updateEntry = require('./events/updateEntry')
const updateEntries = require('./events/updateEntries')
const {MongoClient} = require('mongodb')
const {Client} = require('pg')
const {createClient} = require('redis')
const validator = require('./validator')
const _ = require('./util')

const init = (emitter, arg, type = 'memory') => {
  const validDate = validator.date(emitter)
  const validEntry = validator.entry(emitter)
  const validEntries = validator.entries(emitter, validEntry)
  const validRange = validator.range(emitter)
  const getAvailableHandler = getAvailable(emitter)
  const getEntryHandler = getEntry[type](emitter, arg)
  const getEntriesHandler = getEntries[type](emitter, arg)
  const updateEntryHandler = updateEntry[type](emitter, arg)
  const updateEntriesHandler = updateEntries[type](emitter, arg)
  emitter.on('getAvailable', (begin, end) => {
    if (validRange(begin, end)) setImmediate(getAvailableHandler, begin, end)
  })
  emitter.on('getEntry', date => {
    if (validDate(date)) setImmediate(getEntryHandler, date)
  })
  emitter.on('getEntries', (begin, end) => {
    if (validRange(begin, end)) setImmediate(getEntriesHandler, begin, end)
  })
  emitter.on('updateEntry', entry => {
    if (validEntry(entry)) setImmediate(updateEntryHandler, entry)
  })
  emitter.on('updateEntries', entries => {
    if (validEntries(entries)) setImmediate(updateEntriesHandler, entries)
  })
  emitter.emit('started')
}

const mongodb = (emitter, {host, port, type}) => {
  const url = `mongodb://${host}:${port}`
  MongoClient.connect(url, (err, client) => {
    if (err) return emitter.emit('error', err)
    const collection = client.db('inventory').collection('entries')
    collection.deleteMany({}, err => {
      if (err) return emitter.emit('error', err)
      setImmediate(init, emitter, collection, type)
    })
  })
}

const postgresql = (emitter, {host, port, type}) => {
  const client = new Client({
    database: 'inventory',
    host,
    port
  })
  client.connect(err => {
    if (err) return emitter.emit('error', err)
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
      setImmediate(init, emitter, client, type)
    })
  })
}

const redis = (emitter, {host, port, type}) => {
  const client = createClient({host, port})
  client.on('error', err => emitter.emit('error', err))
  client.on('ready', () => {
    client.flushdb(() => setImmediate(init, emitter, client, type))
  })
}

/**
 * Create a new inventory in memory.
 *
 * @function newInventory
 * @return {EventEmitter}
 */

exports.newInventory = () => {
  const emitter = new EventEmitter()
  const entries = []
  setImmediate(init, emitter, entries)
  return emitter
}

/**
 * @typedef {Object} Opts
 * @property {string} type - the type of database.
 * @property {string} host - the hostname for the database server.
 * @property {number} port - the port for the database server.
 */

/**
 * Create a new inventory in memory or with a database client.
 *
 * @function newInventoryDB
 * @param  {Opts} opts - the configuration options for the database client.
 * @return {EventEmitter}
 */

exports.newInventoryDB = opts => {
  if (!_.isNonEmptyObject(opts)) {
    throw new Error('opts should be a non-empty object')
  }
  if (!_.isNonEmptyString(opts.type)) {
    throw new Error('opts.type should be a non-empty string')
  }
  if (!_.isNonEmptyString(opts.host)) {
    throw new Error('opts.host should be a non-empty string')
  }
  if (!_.isNumber(opts.port) || opts.port <= 1023) {
    throw new Error('opts.port should be a number greater than 1023')
  }
  const emitter = new EventEmitter()
  if (opts.type === 'mongodb') {
    setImmediate(mongodb, emitter, opts)
  } else if (opts.type === 'postgresql') {
    setImmediate(postgresql, emitter, opts)
  } else if (opts.type === 'redis') {
    setImmediate(redis, emitter, opts)
  } else {
    throw new Error('opts.type is not supported')
  }
  return emitter
}
