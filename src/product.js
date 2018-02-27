'use strict'

/* eslint-env node, es6 */

class Product {
  constructor ({incoming, outgoing, shelfLife, start}) {
    this.start = start
    this.end = start + shelfLife
    this.incomingOrders = []
    this.outgoingOrders = []
    if (incoming > 0) {
      this.incomingOrders.push({
        'start': start,
        'end': this.end,
        'quantity': incoming
      })
    }
    if (outgoing > 0) {
      this.outgoingOrders.push({
        'start': start,
        'quantity': outgoing
      })
    }
  }

  sortIncomingOrders () {
    this.incomingOrders.sort((a, b) => {
      return a.start < b.start ? -1 : 1
    })
  }

  sortOutgoingOrders () {
    this.outgoingOrders.sort((a, b) => {
      return a.start < b.start ? -1 : 1
    })
  }

  get incoming () {
    return this.incomingOrders.reduce((acc, order) => acc + order.quantity, 0)
  }

  get outgoing () {
    return this.outgoingOrders.reduce((acc, order) => acc + order.quantity, 0)
  }

  get available () {
    return this.incoming - this.outgoing
  }

  hasIncomingOrder (o1) {
    return this.incomingOrders.some((o2) => {
      return o1.start === o2.start && o1.end === o2.end
    })
  }

  hasOutgoingOrder (o1) {
    return this.outgoingOrders.some((o2) => {
      return o1.start === o2.start
    })
  }

  forwardIncomingOrders (product) {
    this.incomingOrders.forEach((order) => {
      if (order.end > product.start &&
          !product.hasIncomingOrder(order)) {
        product.incomingOrders.push(order)
      }
    })
    product.sortIncomingOrders()
  }

  forwardOutgoingOrders (product) {
    if (this.incomingOrders.length === 1 ||
        this.outgoing > this.incoming) {  
      this.outgoingOrders.forEach((order) => {
        if (order.start < product.start &&
            !product.hasOutgoingOrder(order)) {
          product.outgoingOrders.push(order)
        }
      })
      product.sortOutgoingOrders()
    }
  }

  backwardIncomingOrders (product) {
    this.incomingOrders.forEach((order) => {
      if (!product.hasIncomingOrder(order)) {
        product.incomingOrders.push(order)
      }
    })
    product.sortIncomingOrders()
  }

  backwardOutgoingOrders (product) {
    this.outgoingOrders.forEach((order) => {
      if (!product.hasOutgoingOrder(order)) {
        product.outgoingOrders.push(order)
      }
    })
    product.sortOutgoingOrders()
  }

  isMatch (product) {
    return this.start > product.start &&
           this.start < product.end &&
           product.available > 0
  }
}

module.exports = Product