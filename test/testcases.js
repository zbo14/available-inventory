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
  'available': [3, 4, 3]
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
  'available': [1, 1, 0]
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
  'available': [1, 2, 2, 4]
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
  'available': [1, 2, 2, 4]
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
  'available': [0, 0, -1, 1]
}

exports.successCases = [
  successCase1,
  successCase2,
  successCase3,
  successCase4,
  successCase5
]
