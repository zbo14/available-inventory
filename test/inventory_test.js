'use strict'

/* eslint-env node, es6 */

const {expect} = require('chai')
const {describe, it} = require('mocha')
const newInventory = require('../src')
const {successCases} = require('./testcases')

const inventory = newInventory(10)

describe('inventory', () => {
  successCases.forEach(({entries, available}) => {
    it('updates inventory', (done) => {
      inventory.once('updated', done)
      inventory.emit('updates', entries)
    })
    it('calculates available inventory', (done) => {
      inventory.once('gotAvailable', (result) => {
        expect(result.slice(0, entries.length)).to.deep.equal(available)
        done()
      })
      inventory.emit('getAvailable', available.length)
    })
  })

  // failCases.forEach(({inputs, outputs}) => {
  //   it('fails to calculate available inventory', (done) => {
  //     inventory.once('gotAvailable', (err, result) => {
  //       expect(err).to.be.an('error')
  //       expect(err.message).to.equal(outputs)
  //       expect(result).to.equal(null)
  //       done()
  //     })
  //     inventory.emit('getAvailable', ...inputs)
  //   })
  // })
})
