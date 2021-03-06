'use strict'

/* eslint-env node, es6 */

const AsyncEmitter = require('../src/async-emitter')
const {newInventoryDB} = require('../src')

const emitter = new AsyncEmitter()

const opts = {
  type: 'postgresql',
  host: 'localhost',
  port: 5432
}

const entries = [
  {
    date: 0,
    incoming: 1,
    outgoing: 2,
    shelflife: 3
  },
  {
    date: 1,
    incoming: 2,
    outgoing: 3,
    shelflife: 2
  },
  {
    date: 2,
    incoming: 3,
    outgoing: 4,
    shelflife: 2
  },
  {
    date: 3,
    incoming: 4,
    outgoing: 5,
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
// [-1, -1, -1, -1]
