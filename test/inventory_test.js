'use strict'

/* eslint-env node, es6 */

const {expect} = require('chai')
const {describe, it} = require('mocha')
const {newInventory} = require('../src')
const {checkEntry} = require('./fixtures')
const t = require('./testcases')
const _ = require('../src/util')

const inventory = newInventory(10)

describe('inventory', () => {
  it('fails to create new inventory', (done) => {
    try {
      newInventory(t.inventoryFail.numEntries)
    } catch (err) {
      expect(err).to.be.an('error')
      expect(err.message).to.equal(t.inventoryFail.error.message)
      done()
    }
  })

  t.cases.forEach(({entries, available, start, end}) => {
    it('updates inventory', (done) => {
      inventory.once('updated', done)
      inventory.emit('updates', entries)
    })
    entries.forEach((entry, index) => {
      it('checks each entry', (done) => {
        inventory.once('gotEntry', (result) => {
          checkEntry(result, entry)
          done()
        })
        inventory.emit('getEntry', index)
      })
    })
    it('checks entries', (done) => {
      inventory.once('gotEntries', (results) => {
        _.zipWith(results, entries.slice(start, end), checkEntry)
        done()
      })
      inventory.emit('getEntries', start, end)
    })
    it('gets available inventory', (done) => {
      inventory.once('gotAvailable', (result) => {
        expect(result).to.deep.equal(available)
        done()
      })
      inventory.emit('getAvailable', start, end)
    })
  })

  t.updateFails.forEach(({entry, error}) => {
    it('fails to do single inventory update', (done) => {
      inventory.once('error', (err) => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      })
      inventory.emit('update', entry)
    })
  })

  t.getAvailableFails.forEach(({start, end, error}) => {
    it('fails to get available inventory', (done) => {
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
      expect(err.message).to.equal(t.updatesFail.error.message)
      done()
    })
    inventory.emit('updates', t.updatesFail.entries)
  })
})
