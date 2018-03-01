'use strict'

/* eslint-env node, es6 */

const {expect} = require('chai')
const {describe, it} = require('mocha')
const availableInventory = require('../src')
const {successCases, failCases} = require('./testcases')

describe('available-inventory', () => {
  successCases.forEach(({inputs, outputs}) => {
    it('calculates available inventory', () => {
      const result = availableInventory(inputs)
      expect(result).to.deep.equal(outputs)
    })
  })

  failCases.forEach(({inputs, outputs}) => {
    it('fails to calculate available inventory', (done) => {
      try {
        availableInventory(inputs)
      } catch (err) {
        expect(err.message).to.equal(outputs.message)
        done()
      }
    })
  })
})
