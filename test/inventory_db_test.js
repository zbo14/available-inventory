'use strict'

/* eslint-env node, es6 */

const {describe, it} = require('mocha')
const {expect} = require('chai')
const {newInventoryDB} = require('../src')
const testOps = require('./fixtures')
const t = require('./testcases')
const _ = require('../src/util')

const host = 'localhost'

const mongoOpts = {
  type: 'mongodb',
  host,
  port: 27017
}

const postgresOpts = {
  type: 'postgresql',
  host,
  port: 5432
}

const redisOpts = {
  type: 'redis',
  host,
  port: 6379
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
  testOps(newInventoryDB(redisOpts))
})
