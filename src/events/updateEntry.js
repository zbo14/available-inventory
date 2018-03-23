'use strict'

/* eslint-env node, es6 */

const {entryUpdater} = require('../entry')

/**
 * Event to update a single entry.
 *
 * @event updateEntry
 * @param {Entry} entry
 * @fires updatedEntry
 */

exports.memory = (emitter, entries) => {
  const update = entryUpdater(entries)
  return entry => {
    update(entry)
    emitter.emit('updatedEntry')
  }
}

exports.mongodb = (emitter, collection) => {
  return entry => {
    collection.updateOne({date: entry.date}, {$set: entry}, {upsert: true}, err => {
      emitter.emit('updatedEntry', err)
    })
  }
}

exports.postgresql = (emitter, client) => {
  return ({date, incoming, outgoing, shelflife}) => {
    client.query(`
      INSERT INTO entries(date, incoming, outgoing, shelflife)
      VALUES(${date}, ${incoming}, ${outgoing}, ${shelflife})
      ON CONFLICT (date)
      DO UPDATE SET incoming = ${incoming}, outgoing = ${outgoing}, shelflife = ${shelflife}`,
    err => emitter.emit('updatedEntry', err))
  }
}

exports.redis = (emitter, client) => {
  return entry => {
    const key = entry.date.toString()
    const value = JSON.stringify(entry)
    client.set(key, value, err => emitter.emit('updatedEntry', err))
  }
}
