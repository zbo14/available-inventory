'use strict'

/* eslint-env node, es6 */

const case1 = {
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
  'start': 0,
  'end': 3
}

const case2 = {
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
  'start': 0,
  'end': 3
}

const case3 = {
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
  'start': 0,
  'end': 4
}

const case4 = {
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
  'start': 0,
  'end': 4
}

const case5 = {
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
  'start': 0,
  'end': 4
}

const case6 = {
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
  'start': 0,
  'end': 4
}

const case7 = {
  'entries': [
    {
      'index': 0,
      'incoming': 1,
      'outgoing': 2,
      'shelfLife': 3
    },
    {
      'index': 1,
      'incoming': 2,
      'outgoing': 3,
      'shelfLife': 2
    },
    {
      'index': 2,
      'incoming': 3,
      'outgoing': 4,
      'shelfLife': 2
    },
    {
      'index': 3,
      'incoming': 4,
      'outgoing': 5,
      'shelfLife': 2
    }
  ],
  'available': [-1, -1, -1, -1],
  'start': 0,
  'end': 4
}

const case8 = {
  'entries': [
    {
      'index': 0,
      'incoming': 1,
      'outgoing': 2,
      'shelfLife': 3
    },
    {
      'index': 1,
      'incoming': 2,
      'outgoing': 3,
      'shelfLife': 3
    },
    {
      'index': 2,
      'incoming': 3,
      'outgoing': 4,
      'shelfLife': 2
    },
    {
      'index': 3,
      'incoming': 4,
      'outgoing': 5,
      'shelfLife': 2
    }
  ],
  'available': [-1, -1, -1],
  'start': 1,
  'end': 4
}

const case9 = {
  'entries': [
    {
      'index': 0,
      'incoming': 2,
      'outgoing': 0,
      'shelfLife': 3
    },
    {
      'index': 1,
      'incoming': 1,
      'outgoing': 1,
      'shelfLife': 3
    },
    {
      'index': 2,
      'incoming': 3,
      'outgoing': 4,
      'shelfLife': 3
    },
    {
      'index': 3,
      'incoming': 5,
      'outgoing': 4,
      'shelfLife': 3
    },
    {
      'index': 4,
      'incoming': 4,
      'outgoing': 6,
      'shelfLife': 3
    }
  ],
  'available': [0, 0, 0, 0, 0],
  'start': 0,
  'end': 5
}

const case10 = {
  'entries': [
    {
      'index': 0,
      'incoming': 1,
      'outgoing': 0,
      'shelfLife': 3
    },
    {
      'index': 1,
      'incoming': 1,
      'outgoing': 1,
      'shelfLife': 3
    },
    {
      'index': 2,
      'incoming': 3,
      'outgoing': 4,
      'shelfLife': 3
    },
    {
      'index': 3,
      'incoming': 5,
      'outgoing': 4,
      'shelfLife': 3
    },
    {
      'index': 4,
      'incoming': 4,
      'outgoing': 6,
      'shelfLife': 3
    }
  ],
  'available': [0, 0, 0, 0, -1],
  'start': 0,
  'end': 5
}

const case11 = {
  'entries': [
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
  ],
  'available': [1, 1, 2, 5, 4, 5],
  'start': 0,
  'end': 6
}

// const case12 = {
//   'entries': [
//     {
//       'index': 0,
//       'incoming': 5,
//       'outgoing': 0,
//       'shelfLife': 2
//     },
//     {
//       'index': 1,
//       'incoming': 2,
//       'outgoing': 4,
//       'shelfLife': 2
//     },
//     {
//       'index': 2,
//       'incoming': 1,
//       'outgoing': 2,
//       'shelfLife': 2
//     },
//     {
//       'index': 3,
//       'incoming': 3,
//       'outgoing': 2,
//       'shelfLife': 2
//     }
//   ],
//   'available': [2, 2, 0, 1],
//   'start': 0,
//   'end': 4
// }

exports.cases = [
  case1, case2, case3, case4,
  case5, case6, case7, case8,
  case9, case10, case11
]

const updateFail1 = {
  'entry': {
    'index': 0,
    'incoming': -5,
    'outgoing': 4,
    'shelfLife': 3
  },
  'error': new Error('entry.incoming should be a non-negative number')
}

const updateFail2 = {
  'entry': {
    'index': 0,
    'incoming': 5,
    'outgoing': -4,
    'shelfLife': 3
  },
  'error': new Error('entry.outgoing should be a non-negative number')
}

const updateFail3 = {
  'entry': {
    'index': 0,
    'incoming': 5,
    'outgoing': 4,
    'shelfLife': 0
  },
  'error': new Error('entry.shelfLife should be a positive number')
}

exports.updateFails = [
  updateFail1,
  updateFail2,
  updateFail3
]

const getAvailableFail1 = {
  'start': -1,
  'end': 3,
  'error': new Error('start should be a non-negative number')
}

const getAvailableFail2 = {
  'start': 0,
  'end': 0,
  'error': new Error('end should be a positive number')
}

// const getAvailableFail3 = {
//   'start': 0,
//   'end': 11,
//   'error': new Error('end is out of range')
// }

const getAvailableFail4 = {
  'start': 3,
  'end': 1,
  'error': new Error('end should be greater than start')
}

exports.getAvailableFails = [
  getAvailableFail1,
  getAvailableFail2,
  // getAvailableFail3,
  getAvailableFail4
]

exports.updatesFail = {
  'entries': [],
  'error': new Error('entries should be a non-empty array')
}
