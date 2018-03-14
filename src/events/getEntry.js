'use strict'

/* eslint-env node, es6 */

const {on} = require('../util')

/**
 * Event to get an entry by date.
 *
 * @event getEntry
 * @type  {number}
 * @fires gotEntry
 */

exports.memory = (emitter, entries, validDate) => {
  on(emitter, 'getEntry', date => {
    if (!validDate(date)) return
    emitter.emit('gotEntry', entries[date])
  })
}

exports.mongodb = (emitter, collection, validDate) => {
  on(emitter, 'getEntry', date => {
    if (!validDate(date)) return
    collection.findOne({date}, {projection: {_id: 0}}, (err, entry) => {
      if (err) return emitter.emit('error', err)
      emitter.emit('gotEntry', entry)
    })
  })
}

exports.postgresql = (emitter, client, validDate) => {
  on(emitter, 'getEntry', date => {
    if (!validDate(date)) return
    client.query(`
      SELECT date, incoming, outgoing, shelflife FROM entries
      WHERE date = ${date}`,
    (err, res) => {
      if (err) return emitter.emit('error', err)
      const entry = res.rows[0]
      emitter.emit('gotEntry', entry)
    })
  })
}
