# inventory

Event-driven module for updating incoming orders, outgoing orders, shelf life, and calculating available product.

## Install
`npm i`

## Usage
`npm start` to run example

### Examples

#### Inventory
```js
const {newInventory} = require('./src')
const inventory = newInventory(6)
const entries = [
  {
    index: 0,
    incoming: 3,
    outgoing: 1,
    shelfLife: 3
  },
  {
    index: 1,
    incoming: 1,
    outgoing: 2,
    shelfLife: 3
  },
  {
    index: 2,
    incoming: 2,
    outgoing: 0,
    shelfLife: 3
  },
  {
    index: 3,
    incoming: 3,
    outgoing: 1,
    shelfLife: 3
  },
  {
    index: 4,
    incoming: 4,
    outgoing: 5,
    shelfLife: 3
  },
  {
    index: 5,
    incoming: 2,
    outgoing: 1,
    shelfLife: 3
  }
]

inventory.emit('updateEntries', entries)
inventory.once('gotAvailable', console.log)
inventory.emit('getAvailable', 0, 6)

// console.logs the availability for the 6 days:
// [1, 1, 3, 4, 4, 5]
```

#### InventoryDB

TODO

## Test
`npm test`

For the inventoryDB test, mongod should be running on 'mongodb://localhost:27017'.
