'use strict'

/* eslint-env node, es6 */

const {newInventory} = require('../src')

const inventory = newInventory(6)

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

inventory.once('updatedEntries', () => inventory.emit('getAvailable', 0, 6))
inventory.once('gotAvailable', console.log)
inventory.emit('updateEntries', entries)

// console.logs the availability for the 6 dates:
// [1, 1, 3, 4, 4, 5]
