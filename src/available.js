'use strict'

/* eslint-env node, es6 */

module.exports = (entries) => {
  let i, j, v
  const before = new Array(entries.length).fill(0)
  const after = new Array(entries.length).fill(0)
  const numAvailable = (i) => {
    return entries[i].incoming - entries[i].outgoing + before[i] + after[i]
  }
  for (i = 1; i < entries.length; i++) {
    v = 0
    for (j = i - 1; j >= 0 && entries[j].end > i; j--) {
      if (entries[j].incoming >= entries[j].outgoing && before[j] >= entries[j].incoming) {
        before[i] += Math.max(0, entries[j].incoming - v)
      } else {
        before[i] += Math.max(0, before[j] - entries[j].outgoing + entries[j].incoming - v)
      }
      v += entries[j].outgoing
    }
  }
  for (i = entries.length - 2; i >= 0; i--) {
    if (before[i] - entries[i].outgoing + entries[i].incoming > 0) {
      for (j = i + 1; j < entries.length && numAvailable(i) > 0 && entries[i].end > j; j++) {
        after[i] += Math.min(0, after[j] - entries[j].outgoing + entries[j].incoming)
        if (entries[j].incoming + before[j] < entries[j].outgoing) {
          after[i] += before[j]
        }
      }
    }
  }
  return entries.map((_, i) => numAvailable(i))
}
