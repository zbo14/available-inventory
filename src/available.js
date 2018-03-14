'use strict'

/* eslint-env node, es6 */

const {expires} = require('./entry')
const {_} = require('./util')

module.exports = entries => {
  const available = new Array(entries.length).fill(0)
  const incoming = _.map(entries, entry => entry.incoming)
  const outgoing = _.map(entries, entry => entry.outgoing)
  let i, j, k, v
  available[0] = incoming[0] - outgoing[0]
  v = _.min([incoming[0], outgoing[0]])
  incoming[0] -= v
  outgoing[0] -= v
  for (i = 1; i < entries.length; i++) {
    for (j = i - 1; j >= 0 && expires(entries[j]) > i; j--) {}
    for (j = j + 1; j < i && outgoing[i] > 0; j++) {
      if (incoming[j] > 0) {
        v = _.min([incoming[j], outgoing[i]])
        incoming[j] -= v
        outgoing[i] -= v
        if (outgoing[i] === 0) available[i] += incoming[j]
      }
    }
    for (j; j < i; j++) {
      if (incoming[j] > 0) available[i] += incoming[j]
    }
    if (outgoing[i] > 0) {
      v = _.min([incoming[i], outgoing[i]])
      incoming[i] -= v
      outgoing[i] -= v
    }
    available[i] += incoming[i] - outgoing[i]
  }
  _.each(entries, (entry, i) => {
    incoming[i] = entry.incoming
    outgoing[i] = entry.outgoing
  })
  for (i = entries.length - 1; i > 0; i--) {
    for (j = i - 1; j >= 0 && expires(entries[j]) > i && incoming[i] < outgoing[i]; j--) {
      v = _.max([0, _.min([available[j], incoming[j], outgoing[i] - incoming[i]])])
      if (v > 0) {
        incoming[i] += v
        incoming[j] -= v
        for (k = j; k < i; k++) {
          if (available[k] > 0) available[k] -= _.min([available[k], v])
        }
      }
    }
  }
  return available
}
