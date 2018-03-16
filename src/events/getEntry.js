'use strict'

/* eslint-env node, es6 */

const _ = require('../util')

/**
 * Event to get an entry by date.
 *
 * @event getEntry
 * @type  {number}
 * @fires gotEntry
 */

exports.memory = (emitter, entries) => date => {
  const entry = _.find(entries, entry => entry.date === date)
  emitter.emit('gotEntry', entry)
}

exports.mongodb = (emitter, collection) => {
  return date => {
    collection.findOne({date}, {projection: {_id: 0}}, (err, entry) => {
      if (err) return emitter.emit('error', err)
      emitter.emit('gotEntry', entry)
    })
  }
}

exports.postgresql = (emitter, client) => {
  return date => {
    client.query(`
      SELECT date, incoming, outgoing, shelflife FROM entries
      WHERE date = ${date}`,
    (err, res) => {
      if (err) return emitter.emit('error', err)
      const entry = res.rows[0]
      emitter.emit('gotEntry', entry)
    })
  }
}

exports.redis = (emitter, client) => {
  return date => {
    client.get(date, (err, str) => {
      if (err) return emitter.emit('error', err)
      try {
        const entry = JSON.parse(str)
        emitter.emit('gotEntry', entry)
      } catch (err) {
        emitter.emit('error', err)
      }
    })
  }
}
