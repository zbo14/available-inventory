'use strict'

/* eslint-env node, es6 */

const {expect} = require('chai')
const {describe, it} = require('mocha')
const availableInventory = require('../src')
const {successCases, failCases} = require('./testcases')

describe('inventory', () => {
  successCases.forEach(({inputs, outputs}) => {
    it('calculates available inventory', (done) => {
      availableInventory(...inputs, (err, result) => {
        expect(err).to.equal(null)
        expect(result).to.deep.equal(outputs)
        done()
      })
    })
  })

  failCases.forEach(({inputs, outputs}) => {
    it('fails to calculate available inventory', (done) => {
      availableInventory(...inputs, (err) => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(outputs.message)
        done()
      })
    })
  })
})
