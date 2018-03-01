'use strict'

/* eslint-env node, es6 */

exports.successCases = [
  {
    'inputs': {
      'incoming': [5, 3, 0],
      'outgoing': [2, 2, 0],
      'shelfLife': 2
    },
    'outputs': [3, 4, 3]
  },
  {
    'inputs': {
      'incoming': [5, 3, 0],
      'outgoing': [2, 2, 3],
      'shelfLife': 2
    },
    'outputs': [1, 1, 0]
  },
  {
    'inputs': {
      'incoming': [6, 2, 1],
      'outgoing': [1, 0, 3],
      'shelfLife': 2
    },
    'outputs': [5, 5, 0]
  },
  {
    'inputs': {
      'incoming': [3, 4, 2],
      'outgoing': [2, 6, 1],
      'shelfLife': 2
    },
    'outputs': [0, -1, 1]
  },
  {
    'inputs': {
      'incoming': [2, 4, 2],
      'outgoing': [1, 3, 5],
      'shelfLife': 2
    },
    'outputs': [0, 0, -1]
  },
  {
    'inputs': {
      'incoming': [2, 1, 3, 4],
      'outgoing': [1, 0, 1, 3],
      'shelfLife': 3
    },
    'outputs': [1, 2, 4, 5]
  },
  {
    'inputs': {
      'incoming': [1, 3, 2, 1],
      'outgoing': [2, 2, 3, 0],
      'shelfLife': 2
    },
    'outputs': [-1, 0, 0, 1]
  },
  {
    'inputs': {
      'incoming': [1, 3, 3, 0],
      'outgoing': [0, 2, 2, 3],
      'shelfLife': 3
    },
    'outputs': [0, 0, 0, 0]
  }
]

exports.failCases = [
  {
    'inputs': {
      'incoming': [],
      'outgoing': [2, 2, 0],
      'shelfLife': 2
    },
    'outputs': new Error('incoming should be non-empty array')
  },
  {
    'inputs': exports.fail2 = {
      'incoming': [5, 3, 0],
      'outgoing': [],
      'shelfLife': 2
    },
    'outputs': new Error('outgoing sould be non-empty array')
  },
  {
    'inputs': exports.fail2 = {
      'incoming': [5, 3, 0],
      'outgoing': [2, 2, 0, 3],
      'shelfLife': 2
    },
    'outputs': new Error('incoming and outgoing should have same length')
  },
  {
    'inputs': exports.fail3 = {
      'incoming': [5, 3, 0],
      'outgoing': [2, 2, 0],
      'shelfLife': -2
    },
    'outputs': new Error('shelfLife should be a positive number')
  }
]
