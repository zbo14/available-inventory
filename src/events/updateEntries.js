'use strict'

/* eslint-env node, es6 */

const {updateEntry} = require('../entry')
const {_, on} = require('../util')

/**
 * Event to update multiple entries.
 *
 * @event updateEntries
 * @type  {Entry[]}
 * @fires updatedEntries
 */

exports.memory = (emitter, entries, validEntries) => {
  const updater = updateEntry(entries)
  on(emitter, 'updateEntries', entries => {
    if (!validEntries(entries)) return
    _.each(entries, updater)
    emitter.emit('updatedEntries')
  })
}

exports.mongodb = (emitter, collection, validEntries) => {
  on(emitter, 'updateEntries', entries => {
    if (!validEntries(entries)) return
    const writes = _.map(entries, entry => {
      return {updateOne: {filter: {date: entry.date}, update: {$set: entry}, upsert: true}}
    })
    collection.bulkWrite(writes, err => {
      if (err) return emitter.emit('error', err)
      emitter.emit('updatedEntries')
    })
  })
}

exports.postgresql = (emitter, client, validEntries) => {
  on(emitter, 'updateEntries', entries => {
    if (!validEntries(entries)) return
    const values = _.join(_.map(entries, entry => `(${entry.date}, ${entry.incoming}, ${entry.outgoing}, ${entry.shelflife})`), ',')
    client.query(`
      INSERT INTO entries(date, incoming, outgoing, shelflife)
      VALUES${values}
      ON CONFLICT (date)
      DO UPDATE SET incoming = entries.incoming, outgoing = entries.outgoing, shelflife = entries.shelflife`,
    err => {
      if (err) return emitter.emit('error', err)
      emitter.emit('updatedEntries')
    })
  })
}
