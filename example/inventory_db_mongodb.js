'use strict'

/* eslint-env node, es6 */

const {newInventoryDB} = require('../src')

const inventory = newInventoryDB({
  type: 'mongodb',
  host: 'localhost',
  port: 27017
})

const entries = [
  {
    date: 0,
    incoming: 5,
    outgoing: 0,
    shelflife: 2
  },
  {
    date: 2,
    incoming: 1,
    outgoing: 2,
    shelflife: 2
  },
  {
    date: 3,
    incoming: 3,
    outgoing: 2,
    shelflife: 2
  }
]

inventory.once('started', () => {
  inventory.once('updatedEntries', () => inventory.emit('getAvailable', 0, 4))
  inventory.once('gotAvailable', available => {
    console.log(available)
    process.exit()
  })
  inventory.emit('updateEntries', entries)
})

// console.logs the availability for the 4 dates:
// [5, 5, -1, 1]
