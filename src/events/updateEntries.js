'use strict'

/* eslint-env node, es6 */

const {entryUpdater} = require('../entry')
const _ = require('../util')

/**
 * Event to update multiple entries.
 *
 * @event updateEntries
 * @param {Entry[]} entries
 * @fires updatedEntries
 */

exports.memory = (emitter, entries) => {
  const update = entryUpdater(entries)
  return entries => {
    _.each(entries, update)
    emitter.emit('updatedEntries')
  }
}

exports.mongodb = (emitter, collection) => {
  return entries => {
    const writes = _.map(entries, entry => {
      return {updateOne: {filter: {date: entry.date}, update: {$set: entry}, upsert: true}}
    })
    collection.bulkWrite(writes, err => emitter.emit('updatedEntries', err))
  }
}

exports.postgresql = (emitter, client) => {
  return entries => {
    const values = _.join(_.map(entries, ({date, incoming, outgoing, shelflife}) => {
      return `(${date}, ${incoming}, ${outgoing}, ${shelflife})`
    }), ',')
    client.query(`
      INSERT INTO entries(date, incoming, outgoing, shelflife)
      VALUES${values}
      ON CONFLICT (date)
      DO UPDATE SET incoming = entries.incoming, outgoing = entries.outgoing, shelflife = entries.shelflife`,
    err => emitter.emit('updatedEntries', err))
  }
}

exports.redis = (emitter, client) => {
  return entries => {
    const kvpairs = _.flatMap(entries, entry => [entry.date.toString(), JSON.stringify(entry)])
    client.mset(...kvpairs, err => emitter.emit('updatedEntries', err))
  }
}
