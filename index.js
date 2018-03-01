'use strict'

/* eslint-env node, es6 */

const availableInventory = require('./src')

const results = availableInventory({
  'incoming': [2, 1, 3, 4],
  'outgoing': [1, 0, 1, 3],
  'shelfLife': 3
})

console.log(results)
