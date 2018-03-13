'use strict'

/* eslint-env node, es6 */

const {newInventoryDB} = require('../src')

const inventory = newInventoryDB({
  db: 'postgresql',
  host: 'localhost',
  port: 5432,
  numEntries: 4
})

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

inventory.once('started', () => {
  inventory.once('updatedEntries', () => inventory.emit('getAvailable', 0, 4))
  inventory.once('gotAvailable', available => {
    console.log(available)
    process.exit()
  })
  inventory.emit('updateEntries', entries)
})

// console.logs the availability for the 4 dates:
// [-1, -1, -1, -1]
