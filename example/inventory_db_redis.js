'use strict'

/* eslint-env node, es6 */

const AsyncEmitter = require('../src/async-emitter')
const {newInventoryDB} = require('../src')

const emitter = new AsyncEmitter()

const opts = {
  type: 'redis',
  host: 'localhost',
  port: 6379
}

const entries = [
  {
    date: 0,
    incoming: 5,
    outgoing: 4,
    shelflife: 2
  },
  {
    date: 1,
    incoming: 3,
    outgoing: 4,
    shelflife: 2
  },
  {
    date: 2,
    incoming: 2,
    outgoing: 3,
    shelflife: 2
  },
  {
    date: 3,
    incoming: 2,
    outgoing: 1,
    shelflife: 2
  }
]

emitter.once('ready', err => {
  if (err) throw err
  emitter.once('updatedEntries', err => {
    if (err) throw err
    emitter.emit('getAvailable', 0, 4)
  })
  emitter.once('gotAvailable', (err, available) => {
    if (err) throw err
    console.log(available)
    process.exit()
  })
  emitter.emit('updateEntries', entries)
})

newInventoryDB(emitter, opts)

// console.logs the availability for the 4 dates:
// [0, 0, -1, 1]
