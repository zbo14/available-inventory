'use strict'

/* eslint-env node, es6 */

const {fillMissingEntries} = require('../entry')
const _ = require('../util')

/**
 * Event to get entries within a date range.
 *
 * @event getEntries
 * @param  {number} begin - the beginning of the date range (inclusive).
 * @param  {number} end - the end of the date range (exclusive).
 * @fires  gotEntries
 */

exports.memory = (emitter, entries) => (begin, end) => {
  emitter.emit('gotEntries', fillMissingEntries(entries, begin, end))
}

exports.mongodb = (emitter, collection) => {
  return (begin, end) => {
    collection.find({date: {$gte: begin, $lt: end}}, {projection: {_id: 0}}, (err, cursor) => {
      if (err) return emitter.emit('error', err)
      cursor.sort({date: 1})
      cursor.toArray((err, entries) => {
        if (err) return emitter.emit('error', err)
        const allEntries = fillMissingEntries(entries, begin, end)
        emitter.emit('gotEntries', allEntries)
      })
    })
  }
}

exports.postgresql = (emitter, client) => {
  return (begin, end) => {
    client.query(`
      SELECT date, incoming, outgoing, shelflife FROM entries
      WHERE date >= ${begin} AND date < ${end}
      ORDER BY date`,
    (err, res) => {
      if (err) return emitter.emit('error', err)
      const entries = fillMissingEntries(res.rows, begin, end)
      emitter.emit('gotEntries', entries)
    })
  }
}

exports.redis = (emitter, client) => {
  return (begin, end) => {
    const keys = _.map(_.range(begin, end), x => x.toString())
    client.mget(...keys, (err, arr) => {
      if (err) return emitter.emit('error', err)
      try {
        const entries = fillMissingEntries(_.map(_.filter(arr, Boolean), JSON.parse), begin, end)
        emitter.emit('gotEntries', entries)
      } catch (err) {
        emitter.emit('error', err)
      }
    })
  }
}
