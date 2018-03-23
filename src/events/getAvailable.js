'use strict'

/* eslint-env node, es6 */

const available = require('../available')

/**
 * Event to get available inventory within a timeframe.
 *
 * @event getAvailable
 * @param  {number} begin - the beginning of the date range (inclusive).
 * @param  {number} end - the end of the date range (exclusive).
 * @fires  gotAvailable
 */

module.exports = emitter => (begin, end) => {
  emitter.once('gotEntries', (err, entries) => {
    if (err) return emitter.emit('gotAvailable', err)
    emitter.emit('gotAvailable', null, available(entries))
  })
  emitter.emit('getEntries', begin, end)
}
