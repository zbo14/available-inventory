'use strict'

/* eslint-env node, es6 */

const successCase1 = {
  'entries': [
    {
      'index': 0,
      'incoming': 5,
      'outgoing': 2,
      'shelfLife': 2
    },
    {
      'index': 1,
      'incoming': 3,
      'outgoing': 2,
      'shelfLife': 2
    },
    {
      'index': 2,
      'incoming': 0,
      'outgoing': 0,
      'shelfLife': 2
    }
  ],
  'available': [3, 4, 3],
  'start': 1,
  'end': 3
}

const successCase2 = {
  'entries': [
    {
      'index': 0,
      'incoming': 5,
      'outgoing': 2,
      'shelfLife': 2
    },
    {
      'index': 1,
      'incoming': 3,
      'outgoing': 2,
      'shelfLife': 2
    },
    {
      'index': 2,
      'incoming': 0,
      'outgoing': 3,
      'shelfLife': 2
    }
  ],
  'available': [1, 1, 0],
  'start': 1,
  'end': 3
}

const successCase3 = {
  'entries': [
    {
      'index': 0,
      'incoming': 6,
      'outgoing': 5,
      'shelfLife': 2
    },
    {
      'index': 1,
      'incoming': 4,
      'outgoing': 2,
      'shelfLife': 2
    },
    {
      'index': 2,
      'incoming': 2,
      'outgoing': 3,
      'shelfLife': 2
    },
    {
      'index': 3,
      'incoming': 3,
      'outgoing': 1,
      'shelfLife': 2
    }
  ],
  'available': [1, 2, 2, 4],
  'start': 1,
  'end': 4
}

const successCase4 = {
  'entries': [
    {
      'index': 0,
      'incoming': 6,
      'outgoing': 5,
      'shelfLife': 2
    },
    {
      'index': 1,
      'incoming': 4,
      'outgoing': 2,
      'shelfLife': 3
    },
    {
      'index': 2,
      'incoming': 2,
      'outgoing': 3,
      'shelfLife': 2
    },
    {
      'index': 3,
      'incoming': 3,
      'outgoing': 1,
      'shelfLife': 2
    }
  ],
  'available': [1, 2, 2, 4],
  'start': 1,
  'end': 4
}

const successCase5 = {
  'entries': [
    {
      'index': 0,
      'incoming': 5,
      'outgoing': 4,
      'shelfLife': 2
    },
    {
      'index': 1,
      'incoming': 3,
      'outgoing': 4,
      'shelfLife': 2
    },
    {
      'index': 2,
      'incoming': 2,
      'outgoing': 3,
      'shelfLife': 2
    },
    {
      'index': 3,
      'incoming': 2,
      'outgoing': 1,
      'shelfLife': 2
    }
  ],
  'available': [0, 0, -1, 1],
  'start': 1,
  'end': 4
}

const successCase6 = {
  'entries': [
    {
      'index': 0,
      'incoming': 5,
      'outgoing': 4,
      'shelfLife': 3
    },
    {
      'index': 1,
      'incoming': 3,
      'outgoing': 4,
      'shelfLife': 2
    },
    {
      'index': 2,
      'incoming': 2,
      'outgoing': 3,
      'shelfLife': 2
    },
    {
      'index': 3,
      'incoming': 2,
      'outgoing': 1,
      'shelfLife': 2
    }
  ],
  'available': [0, 0, -1, 1],
  'start': 1,
  'end': 4
}

exports.successCases = [
  successCase1,
  successCase2,
  successCase3,
  successCase4,
  successCase5,
  successCase6
]

const updateFailCase1 = {
  'entry': {
    'index': 0,
    'incoming': -5,
    'outgoing': 4,
    'shelfLife': 3
  },
  'error': new Error('incoming should be a non-negative number')
}

const updateFailCase2 = {
  'entry': {
    'index': 0,
    'incoming': 5,
    'outgoing': -4,
    'shelfLife': 3
  },
  'error': new Error('outgoing should be a non-negative number')
}

const updateFailCase3 = {
  'entry': {
    'index': 0,
    'incoming': 5,
    'outgoing': 4,
    'shelfLife': 0
  },
  'error': new Error('shelfLife should be a positive number')
}

exports.updateFailCases = [
  updateFailCase1,
  updateFailCase2,
  updateFailCase3
]

const calcFailCase1 = {
  'start': 0,
  'end': 3,
  'error': new Error('start should be a positive number')
}

const calcFailCase2 = {
  'start': 3,
  'end': 1,
  'error': new Error('end should be greater than start')
}

const calcFailCase3 = {
  'start': 1,
  'end': 11,
  'error': new Error('end is out of range')
}

exports.calcFailCases = [
  calcFailCase1,
  calcFailCase2,
  calcFailCase3
]

exports.updatesFailCase = {
  'entries': [],
  'error': new Error('entries should be a non-empty array')
}
