'use strict'

/* eslint-env node, es6 */

const _ = require('../util')

/**
 * Event to get an entry by date.
 *
 * @event getEntry
 * @param {number} date
 * @fires gotEntry
 */

exports.memory = (emitter, entries) => date => {
  const entry = _.find(entries, entry => entry.date === date)
  emitter.emit('gotEntry', null, entry)
}

exports.mongodb = (emitter, collection) => {
  return date => {
    collection.findOne({date}, {projection: {_id: 0}}, (err, entry) => {
      if (err) return emitter.emit('gotEntry', err)
      emitter.emit('gotEntry', null, entry)
    })
  }
}

exports.postgresql = (emitter, client) => {
  return date => {
    client.query(`
      SELECT date, incoming, outgoing, shelflife FROM entries
      WHERE date = ${date}`,
    (err, res) => {
      if (err) return emitter.emit('gotEntry', err)
      const entry = res.rows[0]
      emitter.emit('gotEntry', null, entry)
    })
  }
}

exports.redis = (emitter, client) => {
  return date => {
    client.get(date, (err, str) => {
      if (err) return emitter.emit('gotEntry', err)
      try {
        const entry = JSON.parse(str)
        emitter.emit('gotEntry', null, entry)
      } catch (err) {
        emitter.emit('gotEntry', err)
      }
    })
  }
}
