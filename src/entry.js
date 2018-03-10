'use strict'

/* eslint-env node, es6 */

const _ = require('./util')

exports.convertEntry = entry => {
  return {
    index: entry.index,
    expires: entry.index + entry.shelfLife,
    incoming: entry.incoming,
    outgoing: entry.outgoing
  }
}

exports.newEntry = index => {
  return {
    index,
    expires: index + 1,
    incoming: 0,
    outgoing: 0
  }
}

exports.newEntries = (start, end) => {
  return _.map(_.range(start, end), exports.newEntry)
}

exports.fillMissingEntries = (entries, start, end) => {
  const allEntries = []
  let index = start
  _.each(entries, entry => {
    if (entry.index === index) {
      allEntries.push(entry)
      index++
    } else {
      allEntries.push(...exports.newEntries(index, entry.index), entry)
      index = entry.index + 1
    }
  })
  return allEntries
}
