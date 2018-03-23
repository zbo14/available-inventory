'use strict'

/* eslint-env node, es6 */

const AsyncEmitter = require('../src/async-emitter')
const {newInventory} = require('../src')

const emitter = new AsyncEmitter()

const entries = [
  {
    date: 0,
    incoming: 3,
    outgoing: 1,
    shelflife: 3
  },
  {
    date: 1,
    incoming: 1,
    outgoing: 2,
    shelflife: 3
  },
  {
    date: 2,
    incoming: 2,
    outgoing: 0,
    shelflife: 3
  },
  {
    date: 3,
    incoming: 3,
    outgoing: 1,
    shelflife: 3
  },
  {
    date: 4,
    incoming: 4,
    outgoing: 5,
    shelflife: 3
  },
  {
    date: 5,
    incoming: 2,
    outgoing: 1,
    shelflife: 3
  }
]

emitter.once('ready', () => {
  emitter.once('updatedEntries', () => emitter.emit('getAvailable', 0, 6))
  emitter.once('gotAvailable', (err, available) => {
    if (err) throw err
    console.log(available)
  })
  emitter.emit('updateEntries', entries)
})

newInventory(emitter)

// console.logs the availability for the 6 dates:
// [1, 1, 3, 4, 4, 5]
