'use strict'

/* eslint-env node, es6 */

const {expect} = require('chai')
const {describe, it} = require('mocha')
const AvailableInventory = require('..')
const {successCases, failCases} = require('./testcases')

describe('available-inventory', () => {
  const avInv = new AvailableInventory()

  successCases.forEach(({inputs, outputs}) => {
    it('calculates available inventory', (done) => {
      avInv.once('done', (result) => {
        expect(result).to.deep.equal(outputs)
        done()
      })
      avInv.emit('run', inputs)
    })
  })

  failCases.forEach(({inputs, outputs}) => {
    it('fails to calculate available inventory', (done) => {
      avInv.once('error', (result) => {
        expect(result).to.be.an('error')
        expect(result.message).to.equal(outputs.message)
        done()
      })
      avInv.emit('run', inputs)
    })
  })
})
