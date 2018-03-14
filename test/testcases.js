'use strict'

/* eslint-env node, es6 */

exports.cases = [
  {
    entries: [
      {
        date: 0,
        incoming: 5,
        outgoing: 0,
        shelflife: 2
      },
      {
        date: 2,
        incoming: 1,
        outgoing: 2,
        shelflife: 2
      },
      {
        date: 3,
        incoming: 3,
        outgoing: 2,
        shelflife: 2
      }
    ],
    available: [5, 5, -1, 1],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        date: 0,
        incoming: 5,
        outgoing: 2,
        shelflife: 2
      },
      {
        date: 1,
        incoming: 3,
        outgoing: 2,
        shelflife: 2
      },
      {
        date: 2,
        incoming: 0,
        outgoing: 0,
        shelflife: 2
      }
    ],
    available: [3, 4, 3],
    start: 0,
    end: 3
  },
  {
    entries: [
      {
        date: 0,
        incoming: 5,
        outgoing: 2,
        shelflife: 2
      },
      {
        date: 1,
        incoming: 3,
        outgoing: 2,
        shelflife: 2
      },
      {
        date: 2,
        incoming: 0,
        outgoing: 3,
        shelflife: 2
      }
    ],
    available: [1, 1, 0],
    start: 0,
    end: 3
  },
  {
    entries: [
      {
        date: 0,
        incoming: 6,
        outgoing: 5,
        shelflife: 2
      },
      {
        date: 1,
        incoming: 4,
        outgoing: 2,
        shelflife: 2
      },
      {
        date: 2,
        incoming: 2,
        outgoing: 3,
        shelflife: 2
      },
      {
        date: 3,
        incoming: 3,
        outgoing: 1,
        shelflife: 2
      }
    ],
    available: [1, 2, 2, 4],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        date: 0,
        incoming: 6,
        outgoing: 5,
        shelflife: 2
      },
      {
        date: 1,
        incoming: 4,
        outgoing: 2,
        shelflife: 3
      },
      {
        date: 2,
        incoming: 2,
        outgoing: 3,
        shelflife: 2
      },
      {
        date: 3,
        incoming: 3,
        outgoing: 1,
        shelflife: 2
      }
    ],
    available: [1, 2, 2, 4],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        date: 0,
        incoming: 5,
        outgoing: 4,
        shelflife: 2
      },
      {
        date: 1,
        incoming: 3,
        outgoing: 4,
        shelflife: 2
      },
      {
        date: 2,
        incoming: 2,
        outgoing: 3,
        shelflife: 2
      },
      {
        date: 3,
        incoming: 2,
        outgoing: 1,
        shelflife: 2
      }
    ],
    available: [0, 0, -1, 1],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        date: 0,
        incoming: 5,
        outgoing: 4,
        shelflife: 3
      },
      {
        date: 1,
        incoming: 3,
        outgoing: 4,
        shelflife: 2
      },
      {
        date: 2,
        incoming: 2,
        outgoing: 3,
        shelflife: 2
      },
      {
        date: 3,
        incoming: 2,
        outgoing: 1,
        shelflife: 2
      }
    ],
    available: [0, 0, -1, 1],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        date: 0,
        incoming: 1,
        outgoing: 2,
        shelflife: 3
      },
      {
        date: 1,
        incoming: 2,
        outgoing: 3,
        shelflife: 2
      },
      {
        date: 2,
        incoming: 3,
        outgoing: 4,
        shelflife: 2
      },
      {
        date: 3,
        incoming: 4,
        outgoing: 5,
        shelflife: 2
      }
    ],
    available: [-1, -1, -1, -1],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        date: 0,
        incoming: 1,
        outgoing: 2,
        shelflife: 3
      },
      {
        date: 1,
        incoming: 2,
        outgoing: 3,
        shelflife: 3
      },
      {
        date: 2,
        incoming: 3,
        outgoing: 4,
        shelflife: 2
      },
      {
        date: 3,
        incoming: 4,
        outgoing: 5,
        shelflife: 2
      }
    ],
    available: [-1, -1, -1],
    start: 1,
    end: 4
  },
  {
    entries: [
      {
        date: 0,
        incoming: 2,
        outgoing: 0,
        shelflife: 3
      },
      {
        date: 1,
        incoming: 1,
        outgoing: 1,
        shelflife: 3
      },
      {
        date: 2,
        incoming: 3,
        outgoing: 4,
        shelflife: 3
      },
      {
        date: 3,
        incoming: 5,
        outgoing: 4,
        shelflife: 3
      },
      {
        date: 4,
        incoming: 4,
        outgoing: 6,
        shelflife: 3
      }
    ],
    available: [0, 0, 0, 0, 0],
    start: 0,
    end: 5
  },
  {
    entries: [
      {
        date: 0,
        incoming: 1,
        outgoing: 0,
        shelflife: 3
      },
      {
        date: 1,
        incoming: 1,
        outgoing: 1,
        shelflife: 3
      },
      {
        date: 2,
        incoming: 3,
        outgoing: 4,
        shelflife: 3
      },
      {
        date: 3,
        incoming: 5,
        outgoing: 4,
        shelflife: 3
      },
      {
        date: 4,
        incoming: 4,
        outgoing: 6,
        shelflife: 3
      }
    ],
    available: [0, 0, 0, 0, -1],
    start: 0,
    end: 5
  },
  {
    entries: [
      {
        date: 0,
        incoming: 3,
        outgoing: 1,
        shelflife: 3
      },
      {
        date: 1,
        incoming: 1,
        outgoing: 2,
        shelflife: 3
      },
      {
        date: 2,
        incoming: 2,
        outgoing: 0,
        shelflife: 3
      },
      {
        date: 3,
        incoming: 3,
        outgoing: 1,
        shelflife: 3
      },
      {
        date: 4,
        incoming: 4,
        outgoing: 5,
        shelflife: 3
      },
      {
        date: 5,
        incoming: 2,
        outgoing: 1,
        shelflife: 3
      }
    ],
    available: [1, 1, 3, 4, 4, 5],
    start: 0,
    end: 6
  },
  {
    entries: [
      {
        date: 0,
        incoming: 5,
        outgoing: 1,
        shelflife: 2
      },
      {
        date: 1,
        incoming: 2,
        outgoing: 3,
        shelflife: 2
      },
      {
        date: 2,
        incoming: 1,
        outgoing: 3,
        shelflife: 2
      }
    ],
    available: [1, 1, 0],
    start: 0,
    end: 3
  },
  {
    entries: [
      {
        date: 0,
        incoming: 5,
        outgoing: 0,
        shelflife: 2
      },
      {
        date: 1,
        incoming: 2,
        outgoing: 4,
        shelflife: 2
      },
      {
        date: 2,
        incoming: 1,
        outgoing: 2,
        shelflife: 2
      },
      {
        date: 3,
        incoming: 3,
        outgoing: 2,
        shelflife: 2
      }
    ],
    available: [2, 2, 1, 2],
    start: 0,
    end: 4
  },
  {
    entries: [
      {
        date: 0,
        incoming: 3,
        outgoing: 1,
        shelflife: 2
      },
      {
        date: 1,
        incoming: 1,
        outgoing: 2,
        shelflife: 2
      },
      {
        date: 2,
        incoming: 2,
        outgoing: 0,
        shelflife: 2
      },
      {
        date: 3,
        incoming: 3,
        outgoing: 1,
        shelflife: 2
      },
      {
        date: 4,
        incoming: 4,
        outgoing: 5,
        shelflife: 2
      },
      {
        date: 5,
        incoming: 2,
        outgoing: 1,
        shelflife: 2
      }
    ],
    available: [1, 1, 3, 3, 2, 3],
    start: 0,
    end: 6
  }
]

exports.getEntryFails = [
  {
    date: -1,
    error: new Error('date should be a non-negative number')
  },
  {
    date: 11,
    error: new Error('date is out of range')
  }
]

exports.getEntriesFails = [
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
    entry: {},
    error: new Error('entry should be a non-empty object')
  },
  {
    entry: {
      date: -1,
      incoming: 5,
      outgoing: 4,
      shelflife: 3
    },
    error: new Error('entry.date should be a non-negative number')
  },
  {
    entry: {
      date: 0,
      incoming: -5,
      outgoing: 4,
      shelflife: 3
    },
    error: new Error('entry.incoming should be a non-negative number')
  },
  {
    entry: {
      date: 0,
      incoming: 5,
      outgoing: -4,
      shelflife: 3
    },
    error: new Error('entry.outgoing should be a non-negative number')
  },
  {
    entry: {
      date: 0,
      incoming: 5,
      outgoing: 4,
      shelflife: 0
    },
    error: new Error('entry.shelflife should be a positive number')
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
      db: '',
      host: 'localhost',
      port: 1024,
      numEntries: 10
    },
    error: new Error('opts.db should be a non-empty string')
  },
  {
    opts: {
      db: 'mongodb',
      host: '',
      port: 1024,
      numEntries: 10
    },
    error: new Error('opts.host should be a non-empty string')
  },
  {
    opts: {
      db: 'mongodb',
      host: 'localhost',
      port: 1023,
      numEntries: 10
    },
    error: new Error('opts.port should be a number greater than 1023')
  },
  {
    opts: {
      db: 'mongodb',
      host: 'localhost',
      port: 1024,
      numEntries: -10
    },
    error: new Error('opts.numEntries should be a non-negative number')
  },
  {
    opts: {
      db: 'mysql',
      host: 'localhost',
      port: 1024,
      numEntries: 10
    },
    error: new Error('opts.db is not supported')
  }
]
