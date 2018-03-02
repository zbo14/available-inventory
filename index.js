'use strict'

/* eslint-env node, es6 */

const availableInventory = require('./src')

availableInventory(
  [5, 3, 0],
  [2, 2, 0],
  2,
  console.log
)
