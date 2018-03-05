'use strict'

/* eslint-env node, es6 */

const {expect} = require('chai')
const {describe, it} = require('mocha')
const newInventory = require('../src')
const {successCases, updateFailCases, calcFailCases, updatesFailCase} = require('./testcases')

const size = 10
const inventory = newInventory(size)

describe('inventory', () => {
  successCases.forEach(({entries, available, start, end}) => {
    it('updates inventory', (done) => {
      inventory.once('updated', done)
      inventory.emit('updates', entries)
    })
    it('calculates available inventory', (done) => {
      inventory.once('gotAvailable', (result) => {
        expect(result).to.deep.equal(available)
        done()
      })
      inventory.emit('getAvailable', start, end)
    })
  })

  updateFailCases.forEach(({entry, error}) => {
    it('fails to do single inventory update', (done) => {
      inventory.once('error', (err) => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      })
      inventory.emit('update', entry)
    })
  })

  calcFailCases.forEach(({start, end, error}) => {
    it('fails to calculate available inventory', (done) => {
      inventory.once('error', (err) => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      })
      inventory.emit('getAvailable', start, end)
    })
  })

  it('fails to do multiple inventory updates', (done) => {
    inventory.once('error', (err) => {
      expect(err).to.be.an('error')
      expect(err.message).to.equal(updatesFailCase.error.message)
      done()
    })
    inventory.emit('updates', updatesFailCase.entries)
  })
})
