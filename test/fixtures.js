'use strict'

/* eslint-env node, es6 */

const {expect} = require('chai')

exports.checkEntry = (result, entry) => {
  expect(result.incoming).to.equal(entry.incoming)
  expect(result.outgoing).to.equal(entry.outgoing)
  expect(result.start).to.equal(entry.index)
  expect(result.end).to.equal(entry.index + entry.shelfLife)
}
