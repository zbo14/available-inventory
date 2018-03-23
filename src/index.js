'use strict'

/* eslint-env node, es6 */

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
    if (validRange('gotAvailable', begin, end)) getAvailableHandler(begin, end)
  })
  emitter.on('getEntry', date => {
    if (validDate('gotEntry', date)) getEntryHandler(date)
  })
  emitter.on('getEntries', (begin, end) => {
    if (validRange('gotEntries', begin, end)) getEntriesHandler(begin, end)
  })
  emitter.on('updateEntry', entry => {
    if (validEntry('updatedEntry', entry)) updateEntryHandler(entry)
  })
  emitter.on('updateEntries', entries => {
    if (validEntries('updatedEntries', entries)) updateEntriesHandler(entries)
  })
  emitter.emit('ready')
}

const mongodb = (emitter, {host, port, type}) => {
  const url = `mongodb://${host}:${port}`
  MongoClient.connect(url, (err, client) => {
    if (err) return emitter.emit('ready', err)
    const collection = client.db('inventory').collection('entries')
    collection.deleteMany({}, err => {
      if (err) return emitter.emit('ready', err)
      init(emitter, collection, type)
    })
  })
}

const postgresql = (emitter, {host, port, type}, cb) => {
  const client = new Client({
    database: 'inventory',
    host,
    port
  })
  client.connect(err => {
    if (err) return emitter.emit('ready', err)
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
      if (err) return emitter.emit('ready', err)
      init(emitter, client, type, cb)
    })
  })
}

const redis = (emitter, {host, port, type}) => {
  const client = createClient({host, port})
  client.on('error', err => {
    throw err
  })
  client.on('ready', () => client.flushdb(() => init(emitter, client, type)))
}

/**
 * Configure a new inventory in memory.
 *
 * @function newInventory
 * @param {EventEmitter} emitter
 */

exports.newInventory = emitter => {
  const entries = []
  init(emitter, entries)
}

/**
 * @typedef {Object} Opts
 * @property {string} type - the type of database.
 * @property {string} host - the hostname for the database server.
 * @property {number} port - the port number for the database server.
 */

/**
 * Configure a new inventory with a database client.
 *
 * @function newInventoryDB
 * @param {EventEmitter} emitter
 * @param {Opts} opts - the configuration options for the database client.
 */

exports.newInventoryDB = (emitter, opts) => {
  if (!_.isNonEmptyObject(opts)) {
    return emitter.emit('ready', new Error('opts should be a non-empty object'))
  }
  if (!_.isNonEmptyString(opts.type)) {
    return emitter.emit('ready', new Error('opts.type should be a non-empty string'))
  }
  if (!_.isNonEmptyString(opts.host)) {
    return emitter.emit('ready', new Error('opts.host should be a non-empty string'))
  }
  if (!_.isNumber(opts.port) || opts.port <= 1023) {
    return emitter.emit('ready', new Error('opts.port should be a number greater than 1023'))
  }
  if (opts.type === 'mongodb') {
    mongodb(emitter, opts)
  } else if (opts.type === 'postgresql') {
    postgresql(emitter, opts)
  } else if (opts.type === 'redis') {
    redis(emitter, opts)
  } else {
    emitter.emit('ready', new Error('opts.type is not supported'))
  }
}
