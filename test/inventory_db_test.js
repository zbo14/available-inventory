'use strict'

/* eslint-env node, es6 */

const {describe, it} = require('mocha')
const {expect} = require('chai')
const {newInventoryDB} = require('../src')
const {checkEntry} = require('./fixtures')
const {cases, updateFails} = require('./testcases')
const _ = require('../src/util')

let inventoryDB

const opts = {
  'name': 'test',
  'url': 'mongodb://localhost:27017'
}

const {entries, start, end} = cases[0]

describe('inventory-db', () => {
  it('creates inventory db', (done) => {
    inventoryDB = newInventoryDB(opts)
    inventoryDB.once('started', done)
  })

  entries.forEach((entry) => {
    it('does single update', (done) => {
      inventoryDB.once('updated', done)
      inventoryDB.emit('update', entry)
    })

    it('checks single entry', (done) => {
      inventoryDB.once('gotEntry', (result) => {
        checkEntry(result, entry)
        done()
      })
      inventoryDB.emit('getEntry', entry.index)
    })
  })

  updateFails.forEach(({entry, error}) => {
    it('fails to do single update', (done) => {
      inventoryDB.once('error', (err) => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      })
      inventoryDB.emit('update', entry)
    })
  })

  it('checks multiple entries', (done) => {
    inventoryDB.once('gotEntries', (results) => {
      _.zipWith(results, entries, checkEntry)
      done()
    })
    inventoryDB.emit('getEntries', start, end)
  })
})
