'use strict'

/* eslint-env node, es6 */

const available = require('../available')
const {on, once} = require('../util')

/**
 * Event to get available emitter within a timeframe.
 *
 * @event getAvailable
 * @param  {number} begin
 * @param  {number} end
 * @fires  gotAvailable
 */

exports.memory = (emitter, entries, validRange) => {
  on(emitter, 'getAvailable', (begin, end) => {
    if (!validRange(begin, end)) return
    emitter.emit('gotAvailable', available(entries.slice(begin, end)))
  })
}

exports.db = emitter => {
  on(emitter, 'getAvailable', (begin, end) => {
    once(emitter, 'gotEntries', entries => emitter.emit('gotAvailable', available(entries)))
    emitter.emit('getEntries', begin, end)
  })
}
