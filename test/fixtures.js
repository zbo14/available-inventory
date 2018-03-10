'use strict'

/* eslint-env node, es6 */

const {expect} = require('chai')
const {it} = require('mocha')
const t = require('./testcases')
const _ = require('../src/util')

const checkEntry = (result, entry) => {
  expect(result.incoming).to.equal(entry.incoming)
  expect(result.outgoing).to.equal(entry.outgoing)
  expect(result.index).to.equal(entry.index)
  expect(result.expires).to.equal(entry.index + entry.shelfLife)
}

module.exports = inventory => {
  _.each(t.cases, ({entries, available, start, end}) => {
    it('updates inventory', done => {
      inventory.once('updated', done)
      inventory.emit('updateEntries', entries)
    })
    _.each(entries, entry => {
      it('checks entry', done => {
        inventory.once('gotEntry', result => {
          checkEntry(result, entry)
          done()
        })
        inventory.emit('getEntry', entry.index)
      })
    })
    it('gets available inventory', done => {
      inventory.once('gotAvailable', result => {
        expect(result).to.deep.equal(available)
        done()
      })
      inventory.emit('getAvailable', start, end)
    })
  })

  _.each(t.updateEntryFails, ({entry, error}) => {
    it('fails to update entry', done => {
      inventory.once('error', err => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      })
      inventory.emit('updateEntry', entry)
    })
  })

  _.each(t.getAvailableFails, ({start, end, error}) => {
    it('fails to get available inventory', done => {
      inventory.once('error', err => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      })
      inventory.emit('getAvailable', start, end)
    })
  })

  it('fails to update entries', done => {
    const {entries, error} = t.updateEntriesFail
    inventory.once('error', err => {
      expect(err).to.be.an('error')
      expect(err.message).to.equal(error.message)
      done()
    })
    inventory.emit('updateEntries', entries)
  })
}
