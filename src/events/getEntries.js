'use strict'

/* eslint-env node, es6 */

const {fillMissingEntries} = require('../entry')
const {on} = require('../util')

/**
 * Event to get entries within a timeframe.
 *
 * @event getEntries
 * @param  {number} begin
 * @param  {number} end
 * @fires  gotEntries
 */

exports.memory = (emitter, entries, validRange) => {
  on(emitter, 'getEntries', (begin, end) => {
    if (!validRange(begin, end)) return
    emitter.emit('gotEntries', entries.slice(begin, end))
  })
}

exports.mongodb = (emitter, collection, validRange) => {
  on(emitter, 'getEntries', (begin, end) => {
    if (!validRange(begin, end)) return
    collection.find({date: {$gte: begin, $lt: end}}, {projection: {_id: 0}}, (err, cursor) => {
      if (err) return emitter.emit('error', err)
      cursor.sort({date: 1})
      cursor.toArray((err, entries) => {
        if (err) return emitter.emit('error', err)
        const allEntries = fillMissingEntries(entries, begin, end)
        emitter.emit('gotEntries', allEntries)
      })
    })
  })
}

exports.postgresql = (emitter, client, validRange) => {
  on(emitter, 'getEntries', (begin, end) => {
    if (!validRange(begin, end)) return
    client.query(`
      SELECT date, incoming, outgoing, shelflife FROM entries
      WHERE date >= ${begin} AND date < ${end}
      ORDER BY date`,
    (err, res) => {
      if (err) return emitter.emit('error', err)
      const entries = fillMissingEntries(res.rows, begin, end)
      emitter.emit('gotEntries', entries)
    })
  })
}
