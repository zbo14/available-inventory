# inventory

update incoming orders, outgoing orders, and shelf life and get available product.

## Install
`npm i`

## Usage
`npm start` to run example

### Example
```js
const {newInventory} = require('./src')
const inventory = newInventory(6)
const schedule = [
  {
    'index': 0,
    'incoming': 3,
    'outgoing': 1,
    'shelfLife': 3
  },
  {
    'index': 1,
    'incoming': 1,
    'outgoing': 2,
    'shelfLife': 3
  },
  {
    'index': 2,
    'incoming': 2,
    'outgoing': 0,
    'shelfLife': 3
  },
  {
    'index': 3,
    'incoming': 3,
    'outgoing': 1,
    'shelfLife': 3
  },
  {
    'index': 4,
    'incoming': 4,
    'outgoing': 5,
    'shelfLife': 3
  },
  {
    'index': 5,
    'incoming': 2,
    'outgoing': 1,
    'shelfLife': 3
  }
]

inventory.emit('updates', schedule)
inventory.once('gotAvailable', console.log)
inventory.emit('getAvailable', 0, 6)

// console.logs the availability for the 6 days:
// [1, 1, 3, 4, 4, 5]
```

## Test
`npm test`
