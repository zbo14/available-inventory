'use strict'

/* eslint-env node, es6 */

const EventEmitter = require('events')

/**
 * AsyncEmitter
 * @extends EventEmitter
 */

class AsyncEmitter extends EventEmitter {
  constructor () {
    super()
    this.setMaxListeners(Infinity)
  }
  on (eventName, handler) {
    super.on(eventName, (...results) => setImmediate(handler, ...results))
  }
  once (eventName, handler) {
    super.once(eventName, (...results) => setImmediate(handler, ...results))
  }
}

module.exports = AsyncEmitter
