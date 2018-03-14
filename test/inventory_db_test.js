'use strict'

/* eslint-env node, es6 */

const {describe, it} = require('mocha')
const {expect} = require('chai')
const {newInventoryDB} = require('../src')
const testOps = require('./fixtures')
const t = require('./testcases')
const {_} = require('../src/util')

const host = 'localhost'
const numEntries = 10

const mongoOpts = {
  db: 'mongodb',
  host,
  port: 27017,
  numEntries
}

const postgresOpts = {
  db: 'postgresql',
  host,
  port: 5432,
  numEntries
}

describe('inventory-db', () => {
  _.each(t.inventoryDBFails, ({opts, error}) => {
    it('fails to create inventory db', done => {
      try {
        newInventoryDB(opts)
      } catch (err) {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      }
    })
  })
  testOps(newInventoryDB(mongoOpts))
  testOps(newInventoryDB(postgresOpts))
})
