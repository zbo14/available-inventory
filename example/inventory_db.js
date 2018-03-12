'use strict'

/* eslint-env node, es6 */

const {newInventoryDB} = require('../src')
const inventory = newInventoryDB({
  db: 'mongodb',
  name: 'example',
  host: 'localhost',
  port: 27017,
  numEntries: 4
})

const entries = [
  {
    index: 0,
    incoming: 5,
    outgoing: 0,
    shelfLife: 2
  },
  {
    index: 2,
    incoming: 1,
    outgoing: 2,
    shelfLife: 2
  },
  {
    index: 3,
    incoming: 3,
    outgoing: 2,
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
// [5, 5, -1, 1]
