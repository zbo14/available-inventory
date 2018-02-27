'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const AvailableInventory = require('..')

const avInv = new AvailableInventory()

const params1 = {
  'incomingOrders': [5, 3, 0],
  'outgoingOrders': [2, 2, 0],
  'shelfLife': 2
}

const params2 = {
  'incomingOrders': [5, 3, 0],
  'outgoingOrders': [2, 2, 3],
  'shelfLife': 2
}

const params3 = {
  'incomingOrders': [6, 2, 1],
  'outgoingOrders': [1, 0, 3],
  'shelfLife': 2
}

const params4 = {
  'incomingOrders': [6, 2, 1],
  'outgoingOrders': [1, 3, 0],
  'shelfLife': 2
}

// const params5 = {
//   'incomingOrders': [2, 1, 3, 4],
//   'outgoingOrders': [1, 0, 1, 3],
//   'shelfLife': 3
// }

describe('available-inventory', () => {

  it('caculates available inventory in case#1', (done) => {
    avInv.once('done', (available) => {
      expect(available).to.deep.equal([3, 4, 3])
      done()
    })
    avInv.emit('run', params1)
  })

  it('caculates available inventory in case#2', (done) => {
    avInv.once('done', (available) => {
      expect(available).to.deep.equal([1, 1, 0])
      done()
    })
    avInv.emit('run', params2)
  })

  it('caculates available inventory in case#3', (done) => {
     avInv.once('done', (available) => {
      expect(available).to.deep.equal([5, 5, 0])
      done()
    })
    avInv.emit('run', params3)
  })

  it('caculates available inventory in case#4', (done) => {
    avInv.once('done', (available) => {
      expect(available).to.deep.equal([4, 4, 3])
      done()
    })
    avInv.emit('run', params4)
  })
})