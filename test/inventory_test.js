'use strict'

/* eslint-env node, es6 */

const {expect} = require('chai')
const {describe, it} = require('mocha')
const newInventory = require('../src')
const {cases, updateFails, calcFails, updatesFail} = require('./testcases')

const inventory = newInventory(10)

describe('inventory', () => {
  it('fails to create new inventory', (done) => {
    try {
      newInventory(0)
    } catch (err) {
      expect(err).to.be.an('error')
      expect(err.message).to.equal('numEntries should be a positive number')
      done()
    }
  })

  cases.forEach(({entries, available, start, end}) => {
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

  updateFails.forEach(({entry, error}) => {
    it('fails to do single inventory update', (done) => {
      inventory.once('error', (err) => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      })
      inventory.emit('update', entry)
    })
  })

  calcFails.forEach(({start, end, error}) => {
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
      expect(err.message).to.equal(updatesFail.error.message)
      done()
    })
    inventory.emit('updates', updatesFail.entries)
  })
})
