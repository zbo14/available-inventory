'use strict'

/* eslint-env node, es6 */

const {_} = require('./util')

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

exports.updateEntry = entries => entry => {
  entries[entry.date].incoming = entry.incoming
  entries[entry.date].outgoing = entry.outgoing
  entries[entry.date].shelflife = entry.shelflife
}

exports.fillMissingEntries = (entries, begin, end) => {
  const allEntries = []
  let date = begin
  _.each(entries, entry => {
    if (entry.date === date) {
      allEntries.push(entry)
      date++
    } else {
      allEntries.push(...exports.newEntries(date, entry.date), entry)
      date = entry.date + 1
    }
  })
  return allEntries
}
