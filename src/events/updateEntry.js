'use strict'

/* eslint-env node, es6 */

const {updateEntry} = require('../entry')
const {on} = require('../util')

/**
 * Event to update a single entry.
 *
 * @event updateEntry
 * @type  {Entry}
 * @fires updatedEntry
 */

exports.memory = (emitter, entries, validEntry) => {
  const updater = updateEntry(entries)
  on(emitter, 'updateEntry', entry => {
    if (!validEntry(entry)) return
    updater(entry)
    emitter.emit('updatedEntry')
  })
}

exports.mongodb = (emitter, collection, validEntry) => {
  on(emitter, 'updateEntry', entry => {
    if (!validEntry(entry)) return
    collection.updateOne({date: entry.date}, {$set: entry}, {upsert: true}, err => {
      if (err) return emitter.emit('error', err)
      emitter.emit('updatedEntry')
    })
  })
}

exports.postgresql = (emitter, client, validEntry) => {
  on(emitter, 'updateEntry', entry => {
    if (!validEntry(entry)) return
    client.query(`
      INSERT INTO entries(date, incoming, outgoing, shelflife)
      VALUES(${entry.date}, ${entry.incoming}, ${entry.outgoing}, ${entry.shelflife})
      ON CONFLICT (date)
      DO UPDATE SET incoming = ${entry.incoming}, outgoing = ${entry.outgoing}, shelflife = ${entry.shelflife}`,
    err => {
      if (err) return emitter.emit('error', err)
      emitter.emit('updatedEntry')
    })
  })
}
