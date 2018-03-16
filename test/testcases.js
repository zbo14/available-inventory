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
    begin: 0,
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
    begin: 0,
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
    begin: 0,
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
    begin: 0,
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
    begin: 0,
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
    begin: 0,
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
    begin: 0,
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
    begin: 0,
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
    begin: 1,
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
    begin: 0,
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
    begin: 0,
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
    begin: 0,
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
    begin: 0,
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
    begin: 0,
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
    begin: 0,
    end: 6
  }
]

exports.getEntryFail = {
  date: -1,
  error: new Error('date should be a non-negative number')
}

exports.getEntriesFails = [
  {
    begin: -1,
    end: 3,
    error: new Error('begin should be a non-negative number')
  },
  {
    begin: 0,
    end: 0,
    error: new Error('end should be a positive number')
  },
  {
    begin: 3,
    end: 1,
    error: new Error('end should be greater than begin')
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

exports.inventoryDBFails = [
  {
    opts: {},
    error: new Error('opts should be a non-empty object')
  },
  {
    opts: {
      type: '',
      host: 'localhost',
      port: 1024
    },
    error: new Error('opts.type should be a non-empty string')
  },
  {
    opts: {
      type: 'mongodb',
      host: '',
      port: 1024
    },
    error: new Error('opts.host should be a non-empty string')
  },
  {
    opts: {
      type: 'postgresql',
      host: 'localhost',
      port: 1023
    },
    error: new Error('opts.port should be a number greater than 1023')
  },
  {
    opts: {
      type: 'mysql',
      host: 'localhost',
      port: 1024
    },
    error: new Error('opts.type is not supported')
  }
]
