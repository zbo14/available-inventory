# inventory

Update entries with incoming orders, outgoing orders, and product shelf life and calculate available inventory.

## Install
`npm i`

## Usage
`npm start` to run the `inventory` example.

### Examples
See the `example` directory.

#### Inventory

Update entries in memory and calculate available inventory over a 6-step period.

```js
const {newInventory} = require('../src')
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

inventory.once('updated', () => inventory.emit('getAvailable', 0, 6))
inventory.once('gotAvailable', console.log)
inventory.emit('updateEntries', entries)

// console.logs the availability for the 6 steps:
// [1, 1, 3, 4, 4, 5]
```

#### InventoryDB

Update entries in mongodb and calculate available inventory over a 4-step period.

Notice we only update 3 entries; the missing entry is presumed to have `{incoming: 0, outgoing: 0}`.

For this example, mongod should be running on 'mongodb://localhost:27017'.

```js
const {newInventoryDB} = require('../src')
const inventory = newInventoryDB({
  name: 'example',
  url: 'mongodb://localhost:27017',
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
  inventory.once('updated', () => inventory.emit('getAvailable', 0, 4))
  inventory.once('gotAvailable', console.log)
  inventory.emit('updateEntries', entries)
})

// console.logs the availability for the 4 steps:
// [5, 5, -1, 1]
```

## Test
`npm test`

For the `inventory_db_test`, mongod should be running on 'mongodb://localhost:27017'.
