'use strict'

/* eslint-env node, es6 */

exports.successCases = [
  {
    'inputs': [
      [5, 3, 0],
      [2, 2, 0],
      2
    ],
    'outputs': [3, 4, 3]
  },
  {
    'inputs': [
      [5, 3, 0],
      [2, 2, 3],
      2
    ],
    'outputs': [1, 1, 0]
  },
  {
    'inputs': [
      [6, 2, 1],
      [1, 0, 3],
      2
    ],
    'outputs': [5, 5, 0]
  },
  {
    'inputs': [
      [3, 4, 2],
      [2, 6, 1],
      2
    ],
    'outputs': [0, -1, 1]
  },
  {
    'inputs': [
      [2, 4, 2],
      [1, 3, 5],
      2
    ],
    'outputs': [0, 0, -1]
  },
  {
    'inputs': [
      [2, 1, 3, 4],
      [1, 0, 1, 3],
      3
    ],
    'outputs': [1, 2, 4, 5]
  },
  {
    'inputs': [
      [1, 3, 2, 1],
      [2, 2, 3, 0],
      2
    ],
    'outputs': [-1, 0, 0, 1]
  },
  {
    'inputs': [
      [1, 3, 3, 0],
      [0, 2, 2, 3],
      3
    ],
    'outputs': [0, 0, 0, 0]
  }
]

exports.failCases = [
  {
    'inputs': [
      [],
      [2, 2, 0],
      2
    ],
    'outputs': new Error('incoming should be non-empty array')
  },
  {
    'inputs': [
      [5, 3, 0],
      [],
      2
    ],
    'outputs': new Error('outgoing sould be non-empty array')
  },
  {
    'inputs': [
      [5, 3, 0],
      [2, 2, 0, 3],
      2
    ],
    'outputs': new Error('incoming and outgoing should have same length')
  },
  {
    'inputs': [
      [5, 3, 0],
      [2, 2, 0],
      -2
    ],
    'outputs': new Error('shelfLife should be a positive number')
  }
]
