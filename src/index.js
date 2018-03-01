'use strict'

/* eslint-env node, es6 */

const _ = require('./util')

module.exports = ({incoming, outgoing, shelfLife}) => {
  if (!_.isNotEmptyArray(incoming)) {
    throw new TypeError('incoming should be non-empty array')
  }
  if (!_.isNotEmptyArray(outgoing)) {
    throw new TypeError('outgoing sould be non-empty array')
  }
  if (incoming.length !== outgoing.length) {
    throw new Error('incoming and outgoing should have same length')
  }
  if (!_.isPositiveNumber(shelfLife)) {
    throw new TypeError('shelfLife should be a positive number')
  }

  let i, j, k
  const diffs = _.zipWith(incoming, outgoing, _.subtract)

  for (i = 0; i < diffs.length; i++) {
    if (diffs[i] < 0) {
      for (j = i; j > i - shelfLife; j--) {
        for (k = j - shelfLife + 1; k < j && diffs[i] < 0; k++) {
          if (diffs[k] > 0) {
            if (diffs[i] < -diffs[k]) {
              diffs[i] += diffs[k]
              diffs[k] = 0
            } else {
              diffs[k] += diffs[i]
              diffs[i] = 0
            }
          }
        }
      }
    }
  }

  for (i = 0; i < diffs.length - 1; i++) {
    if (diffs[i] > 0) {
      j = i + 1
      diffs[j] += diffs[i]
      if (j >= shelfLife) {
        diffs[j] -= Math.abs(diffs[j - shelfLife] - outgoing[i])
      }
    }
  }

  return diffs
}
