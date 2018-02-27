'use strict'

/* eslint-env node, es6 */

const {EventEmitter} = require('events')
const Product = require('./product')
const _ = require('./util')

class AvailableInventory extends EventEmitter {

  constructor() {
    super()
    this.handlers([
      'run',
      'main',
      'continue',
      'forwardOrders',
      'tradeOrders',
      'backwardOrders',
      'finish'
    ])
  }

  handlers (events) {
    events.forEach((event) => {
      const handler = (...args) => {
        setImmediate(() => this[event](...args))
      } 
      super.on(event, handler)
    })
  }

  run ({incomingOrders, outgoingOrders, shelfLife}) {
    if (!_.isNotEmptyArray(incomingOrders)) {
      return this.emit('error', new Error('incomingOrders should be non-empty array'))
    } else if (!_.isNotEmptyArray(outgoingOrders)) {
      return this.emit('error', new Error('outgoingOrders sould be non-empty array'))
    } else if (incomingOrders.length !== outgoingOrders.length) {
      return this.emit('error', new Error('incomingOrders and outgoingOrders should have same length'))
    } else if (!_.isPositiveNumber(shelfLife)) {
      return this.emit('error', new Error('shelfLife should be a positive number'))
    }
    const products = incomingOrders.map((incoming, start) => {
      const outgoing = outgoingOrders[start]
      return new Product({incoming, outgoing, shelfLife, start})
    })
    this.emit('main', products)
  }

  main (products, i=0, j=0) {
    if (products[i].isMatch(products[j])) {
      if (products[i].available < 0) {
        this.emit('tradeOrders', products, i, j)
      } else {
        this.emit('forwardOrders', products, i, j)
      }
    } else {
      this.emit('continue', products, i, j)
    }
  }

  forwardOrders (products, i, j) {
    products[j].forwardIncomingOrders(products[i])
    products[j].forwardOutgoingOrders(products[i])
    this.emit('continue', products, i, j)
  }

  tradeOrders (products, i, j) {
    products[j].forwardIncomingOrders(products[i])
    products[j].forwardOutgoingOrders(products[i])
    this.emit('backwardOrders', products, i, j)
  }

  backwardOrders (products, i, j, k=i-1) {
    if (k < 0) {
      this.emit('continue', products, i, j)
    } else {
      products[k+1].backwardIncomingOrders(products[k])
      products[k+1].backwardOutgoingOrders(products[k])
      this.emit('backwardOrders', products, i, j, k-1)
    }
  }

  continue (products, i, j) {
    if (++j < products.length) {
      this.emit('main', products, i, j)
    } else if (++i < products.length) {
      this.emit('main', products, i)
    } else {
      this.emit('finish', products)
    }
  }

  finish (products) {
    const available = products.map((product) => product.available)
    this.emit('done', available)
  }
}

module.exports = AvailableInventory