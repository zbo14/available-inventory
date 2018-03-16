# inventory

Update entries with incoming orders, outgoing orders, and product shelf life and calculate available inventory.

## Install
`npm i`

## Usage
`npm start` to run the `inventory` example.

## Documentation
`npm run doc`

## Test
`npm test`

For the `inventory_db_test`, mongod should be running on 'mongodb://localhost:27017', pg_ctl should be running on 'postgres://localhost:5432' and there should be a database named 'inventory'.

### Examples
See the `example` directory.

#### Inventory

Update entries in memory and calculate available inventory over a 6-step period.

```js
const {newInventory} = require('../src')

const inventory = newInventory()

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

inventory.once('started', () => {
  inventory.once('updatedEntries', () => inventory.emit('getAvailable', 0, 6))
  inventory.once('gotAvailable', console.log)
  inventory.emit('updateEntries', entries)
})

// console.logs the availability for the 6 dates:
// [1, 1, 3, 4, 4, 5]
```

#### InventoryDB

##### MongoDB

Update entries in mongodb and calculate available inventory over a 4-step period.

Notice we only update 3 entries; the missing entry is assumed to have `{incoming: 0, outgoing: 0}`.

For this example, mongod should be running on 'mongodb://localhost:27017'.

```js
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
```

##### PostgreSQL

Update entries in postgresql and calculate inventory over a 4-step period.

For this example, pg_ctl should be running on 'postgres://localhost:5432' and there should be a database named 'inventory'.

```js
const {newInventoryDB} = require('../src')

const inventory = newInventoryDB({
  type: 'postgresql',
  host: 'localhost',
  port: 5432
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
```
