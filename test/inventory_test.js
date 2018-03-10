'use strict'

/* eslint-env node, es6 */

const {expect} = require('chai')
const {describe, it} = require('mocha')
const {newInventory} = require('../src')
const testOps = require('./fixtures')
const {inventoryFail} = require('./testcases')

describe('inventory', () => {
  it('fails to create new inventory', done => {
    const {error, numEntries} = inventoryFail
    try {
      newInventory(numEntries)
    } catch (err) {
      expect(err).to.be.an('error')
      expect(err.message).to.equal(error.message)
      done()
    }
  })

  testOps(newInventory(10))
})
