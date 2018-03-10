'use strict'

/* eslint-env node, es6 */

exports.cases = [
  {
    entries: [
      {
        index: 0,
        incoming: 5,
        outgoing: 0,
        shelfLife: 2
      },
      {
        index: 2,
        incoming: 1,
        outgoing: 2,
        shelfLife: 2
      },
      {
        index: 3,
        incoming: 3,
        outgoing: 2,
        shelfLife: 2
      }
    ],
    available: [5, 5, -1, 1],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        index: 0,
        incoming: 5,
        outgoing: 2,
        shelfLife: 2
      },
      {
        index: 1,
        incoming: 3,
        outgoing: 2,
        shelfLife: 2
      },
      {
        index: 2,
        incoming: 0,
        outgoing: 0,
        shelfLife: 2
      }
    ],
    available: [3, 4, 3],
    start: 0,
    end: 3
  },
  {
    entries: [
      {
        index: 0,
        incoming: 5,
        outgoing: 2,
        shelfLife: 2
      },
      {
        index: 1,
        incoming: 3,
        outgoing: 2,
        shelfLife: 2
      },
      {
        index: 2,
        incoming: 0,
        outgoing: 3,
        shelfLife: 2
      }
    ],
    available: [1, 1, 0],
    start: 0,
    end: 3
  },
  {
    entries: [
      {
        index: 0,
        incoming: 6,
        outgoing: 5,
        shelfLife: 2
      },
      {
        index: 1,
        incoming: 4,
        outgoing: 2,
        shelfLife: 2
      },
      {
        index: 2,
        incoming: 2,
        outgoing: 3,
        shelfLife: 2
      },
      {
        index: 3,
        incoming: 3,
        outgoing: 1,
        shelfLife: 2
      }
    ],
    available: [1, 2, 2, 4],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        index: 0,
        incoming: 6,
        outgoing: 5,
        shelfLife: 2
      },
      {
        index: 1,
        incoming: 4,
        outgoing: 2,
        shelfLife: 3
      },
      {
        index: 2,
        incoming: 2,
        outgoing: 3,
        shelfLife: 2
      },
      {
        index: 3,
        incoming: 3,
        outgoing: 1,
        shelfLife: 2
      }
    ],
    available: [1, 2, 2, 4],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        index: 0,
        incoming: 5,
        outgoing: 4,
        shelfLife: 2
      },
      {
        index: 1,
        incoming: 3,
        outgoing: 4,
        shelfLife: 2
      },
      {
        index: 2,
        incoming: 2,
        outgoing: 3,
        shelfLife: 2
      },
      {
        index: 3,
        incoming: 2,
        outgoing: 1,
        shelfLife: 2
      }
    ],
    available: [0, 0, -1, 1],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        index: 0,
        incoming: 5,
        outgoing: 4,
        shelfLife: 3
      },
      {
        index: 1,
        incoming: 3,
        outgoing: 4,
        shelfLife: 2
      },
      {
        index: 2,
        incoming: 2,
        outgoing: 3,
        shelfLife: 2
      },
      {
        index: 3,
        incoming: 2,
        outgoing: 1,
        shelfLife: 2
      }
    ],
    available: [0, 0, -1, 1],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        index: 0,
        incoming: 1,
        outgoing: 2,
        shelfLife: 3
      },
      {
        index: 1,
        incoming: 2,
        outgoing: 3,
        shelfLife: 2
      },
      {
        index: 2,
        incoming: 3,
        outgoing: 4,
        shelfLife: 2
      },
      {
        index: 3,
        incoming: 4,
        outgoing: 5,
        shelfLife: 2
      }
    ],
    available: [-1, -1, -1, -1],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        index: 0,
        incoming: 1,
        outgoing: 2,
        shelfLife: 3
      },
      {
        index: 1,
        incoming: 2,
        outgoing: 3,
        shelfLife: 3
      },
      {
        index: 2,
        incoming: 3,
        outgoing: 4,
        shelfLife: 2
      },
      {
        index: 3,
        incoming: 4,
        outgoing: 5,
        shelfLife: 2
      }
    ],
    available: [-1, -1, -1],
    start: 1,
    end: 4
  },
  {
    entries: [
      {
        index: 0,
        incoming: 2,
        outgoing: 0,
        shelfLife: 3
      },
      {
        index: 1,
        incoming: 1,
        outgoing: 1,
        shelfLife: 3
      },
      {
        index: 2,
        incoming: 3,
        outgoing: 4,
        shelfLife: 3
      },
      {
        index: 3,
        incoming: 5,
        outgoing: 4,
        shelfLife: 3
      },
      {
        index: 4,
        incoming: 4,
        outgoing: 6,
        shelfLife: 3
      }
    ],
    available: [0, 0, 0, 0, 0],
    start: 0,
    end: 5
  },
  {
    entries: [
      {
        index: 0,
        incoming: 1,
        outgoing: 0,
        shelfLife: 3
      },
      {
        index: 1,
        incoming: 1,
        outgoing: 1,
        shelfLife: 3
      },
      {
        index: 2,
        incoming: 3,
        outgoing: 4,
        shelfLife: 3
      },
      {
        index: 3,
        incoming: 5,
        outgoing: 4,
        shelfLife: 3
      },
      {
        index: 4,
        incoming: 4,
        outgoing: 6,
        shelfLife: 3
      }
    ],
    available: [0, 0, 0, 0, -1],
    start: 0,
    end: 5
  },
  {
    entries: [
      {
        index: 0,
        incoming: 3,
        outgoing: 1,
        shelfLife: 3
      },
      {
        index: 1,
        incoming: 1,
        outgoing: 2,
        shelfLife: 3
      },
      {
        index: 2,
        incoming: 2,
        outgoing: 0,
        shelfLife: 3
      },
      {
        index: 3,
        incoming: 3,
        outgoing: 1,
        shelfLife: 3
      },
      {
        index: 4,
        incoming: 4,
        outgoing: 5,
        shelfLife: 3
      },
      {
        index: 5,
        incoming: 2,
        outgoing: 1,
        shelfLife: 3
      }
    ],
    available: [1, 1, 3, 4, 4, 5],
    start: 0,
    end: 6
  },
  {
    entries: [
      {
        index: 0,
        incoming: 5,
        outgoing: 1,
        shelfLife: 2
      },
      {
        index: 1,
        incoming: 2,
        outgoing: 3,
        shelfLife: 2
      },
      {
        index: 2,
        incoming: 1,
        outgoing: 3,
        shelfLife: 2
      }
    ],
    available: [1, 1, 0],
    start: 0,
    end: 3
  },
  {
    entries: [
      {
        index: 0,
        incoming: 5,
        outgoing: 0,
        shelfLife: 2
      },
      {
        index: 1,
        incoming: 2,
        outgoing: 4,
        shelfLife: 2
      },
      {
        index: 2,
        incoming: 1,
        outgoing: 2,
        shelfLife: 2
      },
      {
        index: 3,
        incoming: 3,
        outgoing: 2,
        shelfLife: 2
      }
    ],
    available: [2, 2, 1, 2],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        index: 0,
        incoming: 3,
        outgoing: 1,
        shelfLife: 2
      },
      {
        index: 1,
        incoming: 1,
        outgoing: 2,
        shelfLife: 2
      },
      {
        index: 2,
        incoming: 2,
        outgoing: 0,
        shelfLife: 2
      },
      {
        index: 3,
        incoming: 3,
        outgoing: 1,
        shelfLife: 2
      },
      {
        index: 4,
        incoming: 4,
        outgoing: 5,
        shelfLife: 2
      },
      {
        index: 5,
        incoming: 2,
        outgoing: 1,
        shelfLife: 2
      }
    ],
    available: [1, 1, 3, 3, 2, 3],
    start: 0,
    end: 6
  }
]

exports.getAvailableFails = [
  {
    start: -1,
    end: 3,
    error: new Error('start should be a non-negative number')
  },
  {
    start: 0,
    end: 0,
    error: new Error('end should be a positive number')
  },
  {
    start: 0,
    end: 11,
    error: new Error('end is out of range')
  },
  {
    start: 3,
    end: 1,
    error: new Error('end should be greater than start')
  }
]

exports.updateEntryFails = [
  {
    entry: {
      index: 0,
      incoming: -5,
      outgoing: 4,
      shelfLife: 3
    },
    error: new Error('entry.incoming should be a non-negative number')
  },
  {
    entry: {
      index: 0,
      incoming: 5,
      outgoing: -4,
      shelfLife: 3
    },
    error: new Error('entry.outgoing should be a non-negative number')
  },
  {
    entry: {
      index: 0,
      incoming: 5,
      outgoing: 4,
      shelfLife: 0
    },
    error: new Error('entry.shelfLife should be a positive number')
  }
]

exports.updateEntriesFail = {
  entries: [],
  error: new Error('entries should be a non-empty array')
}

exports.inventoryFail = {
  numEntries: 0,
  error: new Error('numEntries should be a positive number')
}

exports.inventoryDBFails = [
  {
    opts: {},
    error: new Error('opts should be a non-empty object')
  },
  {
    opts: {
      name: '',
      url: 'mongodb://localhost:27017',
      numEntries: 10
    },
    error: new Error('opts.name should be a non-empty string')
  },
  {
    opts: {
      name: 'test',
      url: '',
      numEntries: 10
    },
    error: new Error('opts.url should be a non-empty string')
  },
  {
    opts: {
      name: 'test',
      url: 'mongodb://localhost:27017',
      numEntries: -10
    },
    error: new Error('opts.numEntries should be a non-negative number')
  }
]
