'use strict'

/* eslint-env node, es6 */

const newInventory = require('./src')

const inventory = newInventory(4)

inventory.emit('updates', [
  {
    'index': 0,
    'incoming': 5,
    'outgoing': 4,
    'shelfLife': 2
  },
  {
    'index': 1,
    'incoming': 3,
    'outgoing': 4,
    'shelfLife': 2
  },
  {
    'index': 2,
    'incoming': 2,
    'outgoing': 3,
    'shelfLife': 2
  },
  {
    'index': 3,
    'incoming': 2,
    'outgoing': 1,
    'shelfLife': 2
  }
])

inventory.on('gotAvailable', console.log)
inventory.emit('getAvailable', 4)
