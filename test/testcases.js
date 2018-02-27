'use strict'

/* eslint-env node, es6 */

exports.successCases = [
  {
    'inputs': {
      'incomingOrders': [5, 3, 0],
      'outgoingOrders': [2, 2, 0],
      'shelfLife': 2
    },
    'outputs': [3, 4, 3]
  },
  {
    'inputs': {
      'incomingOrders': [5, 3, 0],
      'outgoingOrders': [2, 2, 3],
      'shelfLife': 2
    },
    'outputs': [1, 1, 0]
  },
  {
    'inputs': {
      'incomingOrders': [6, 2, 1],
      'outgoingOrders': [1, 0, 3],
      'shelfLife': 2
    },
    'outputs': [5, 5, 0]
  },
  {
    'inputs': {
      'incomingOrders': [2, 1, 3, 4],
      'outgoingOrders': [1, 0, 1, 3],
      'shelfLife': 3
    },
    'outputs': [1, 2, 4, 5]
  }
]

exports.failCases = [
  {
    'inputs': {
      'incomingOrders': [],
      'outgoingOrders': [2, 2, 0],
      'shelfLife': 2
    },
    'outputs': new Error('incomingOrders should be non-empty array')
  },
  {
    'inputs': exports.fail2 = {
      'incomingOrders': [5, 3, 0],
      'outgoingOrders': [],
      'shelfLife': 2
    },
    'outputs': new Error('outgoingOrders sould be non-empty array')
  },
  {
    'inputs': exports.fail2 = {
      'incomingOrders': [5, 3, 0],
      'outgoingOrders': [2, 2, 0, 3],
      'shelfLife': 2
    },
    'outputs': new Error('incomingOrders and outgoingOrders should have same length')
  },
  {
    'inputs': exports.fail3 = {
      'incomingOrders': [5, 3, 0],
      'outgoingOrders': [2, 2, 0],
      'shelfLife': -2
    },
    'outputs': new Error('shelfLife should be a positive number')
  }
]
