'use strict'

/* eslint-env node, es6 */

const {newInventoryDB} = require('../src')
const inventory = newInventoryDB({
  db: 'postgresql',
  name: 'example',
  host: 'localhost',
  port: 5432,
  numEntries: 4
})

const entries = [
  {
    index: 0,
    incoming: 1,
    outgoing: 2,
    shelfLife: 3
  },
  {
    index: 1,
    incoming: 2,
    outgoing: 3,
    shelfLife: 2
  },
  {
    index: 2,
    incoming: 3,
    outgoing: 4,
    shelfLife: 2
  },
  {
    index: 3,
    incoming: 4,
    outgoing: 5,
    shelfLife: 2
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

// console.logs the availability for the 4 steps:
// [-1, -1, -1, -1]
