'use strict'

/* eslint-env node, es6 */

exports.convertEntry = (entry) => {
  return {
    'start': entry.index,
    'end': entry.index + entry.shelfLife,
    'incoming': entry.incoming,
    'outgoing': entry.outgoing
  }
}

exports.newEntry = (index) => {
  return {
    'start': index,
    'end': index,
    'incoming': 0,
    'outgoing': 0
  }
}
