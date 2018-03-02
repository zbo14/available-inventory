'use strict'

/* eslint-env node, es6 */

const _ = require('./util')

const entry = () => {
  let idx = -1
  return (ins, outs, shelfLife) => {
    idx++
    return {
      'idx': idx,
      'incoming': [{
        'idx': idx,
        'end': idx + shelfLife,
        'qty': ins,
        'rem': ins,
        'ext': 0
      }],
      'outgoing': {
        'qty': outs,
        'rem': outs
      }
    }
  }
}

const fulfill = ({incoming, outgoing}) => {
  for (let i = 0; i < incoming.length && outgoing.rem !== 0; i++) {
    if (incoming[i].rem < outgoing.rem) {
      outgoing.rem -= incoming[i].rem
      incoming[i].rem = 0
    } else {
      incoming[i].rem -= outgoing.rem
      outgoing.rem = 0
    }
  }
}

const sortIncoming = (entry) => {
  entry.incoming.sort((a, b) => a.idx < b.idx ? -1 : 1)
}

const pass = (e1, e2) => {
  for (let i = 0; i < e1.incoming.length; i++) {
    if (e1.incoming[i].qty > 0 && e1.incoming[i].end !== e2.idx) {
      e2.incoming.push(e1.incoming[i])
    }
  }
}

const available = ({idx, incoming, outgoing}) => {
  return incoming.reduce((acc, order) => {
    return idx <= order.idx ? acc + order.rem + order.ext : acc + order.rem
  }, -outgoing.rem)
}

const adjust = ({idx, incoming, outgoing}) => {
  const today = incoming.find((order) => idx === order.idx)
  let toAdd = today.rem > outgoing.qty ? outgoing.qty : 0
  if (toAdd > 0) {
    for (let i = 0; incoming[i].idx < idx && toAdd > 0; i++) {
      if (incoming[i].rem < incoming[i].qty) {
        if (incoming[i].qty > incoming[i].rem + toAdd) {
          incoming[i].ext += toAdd
          toAdd = 0
        } else {
          toAdd -= incoming[i].qty - incoming[i].rem
          incoming[i].ext = incoming[i].qty - incoming[i].rem
        }
      }
    }
  }
}

module.exports = (incoming, outgoing, shelfLife, cb) => {
  if (!_.isNotEmptyArray(incoming)) {
    return setImmediate(cb, new TypeError('incoming should be non-empty array'))
  }
  if (!_.isNotEmptyArray(outgoing)) {
    return setImmediate(cb, new TypeError('outgoing sould be non-empty array'))
  }
  if (incoming.length !== outgoing.length) {
    return setImmediate(cb, new Error('incoming and outgoing should have same length'))
  }
  let shelfLives
  if (_.isPositiveNumber(shelfLife)) {
    shelfLives = new Array(incoming.length).fill(shelfLife)
  } else if (_.isNotEmptyArray(shelfLife)) {
    if (incoming.length !== shelfLife.length) {
      return setImmediate(cb, new TypeError('incoming and shelfLife should have same length'))
    }
    shelfLives = shelfLife
  } else {
    return setImmediate(cb, new TypeError('shelfLife should be a positive number or non-empty array'))
  }

  const entries = _.zipWith(incoming, outgoing, shelfLives, entry())
  fulfill(entries[0])
  pass(entries[0], entries[1])

  for (let i = 1; i + 1 < entries.length; i++) {
    sortIncoming(entries[i])
    fulfill(entries[i])
    pass(entries[i], entries[i + 1])
  }

  const last = entries.length - 1
  sortIncoming(entries[last])
  fulfill(entries[last])

  for (let i = entries.length - 1; i >= 0; i--) {
    adjust(entries[i])
  }

  setImmediate(cb, null, entries.map(available))
}
