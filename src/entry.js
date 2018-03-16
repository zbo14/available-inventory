'use strict'

/* eslint-env node, es6 */

const _ = require('./util')

/**
 * @typedef  {Object} Entry
 * @property {number} date - the date of the entry.
 * @property {number} incoming - the number of incoming product.
 * @property {number} outgoing - the number of outgoing product.
 * @property {number} shelflife - the shelf life of the incoming product.
 */

exports.expires = entry => entry.date + entry.shelflife

exports.newEntry = date => {
  return {
    date,
    incoming: 0,
    outgoing: 0,
    shelflife: 1
  }
}

exports.newEntries = (begin, end) => {
  return _.map(_.range(begin, end), exports.newEntry)
}

exports.entryUpdater = entries => entry => {
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].date === entry.date) {
      entries[i] = entry
      return
    } else if (entries[i].date > entry.date) {
      entries.splice(i, 0, entry)
      return
    }
  }
  entries.push(entry)
}

exports.fillMissingEntries = (entries, begin, end) => {
  const allEntries = []
  for (let date = begin, i = 0; date < end; i++) {
    if (entries[i].date === date) {
      allEntries.push(entries[i])
      date++
    } else if (entries[i].date > date) {
      allEntries.push(...exports.newEntries(date, entries[i].date), entries[i])
      date = entries[i].date + 1
    }
  }
  return allEntries
}
