'use strict'

/* eslint-env node, es6 */

const _ = require('./util')

/**
 * @typedef  {Object} Entry
 * @property {number} date
 * @property {number} incoming
 * @property {number} outgoing
 * @property {number} shelflife
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

exports.newEntries = (start, end) => {
  return _.map(_.range(start, end), exports.newEntry)
}

exports.fillMissingEntries = (entries, start, end) => {
  const allEntries = []
  let date = start
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
