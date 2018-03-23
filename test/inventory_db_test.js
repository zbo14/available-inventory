'use strict'

/* eslint-env node, es6 */

const AsyncEmitter = require('../src/async-emitter')
const {describe, it} = require('mocha')
const {expect} = require('chai')
const {newInventoryDB} = require('../src')
const fixtures = require('./fixtures')
const t = require('./testcases')
const _ = require('../src/util')

const host = 'localhost'

const mongodbOpts = {
  type: 'mongodb',
  host,
  port: 27017
}

const postgresqlOpts = {
  type: 'postgresql',
  host,
  port: 5432
}

const redisOpts = {
  type: 'redis',
  host,
  port: 6379
}

const testDB = (opts, done) => {
  const emitter = new AsyncEmitter()
  emitter.on('ready', err => {
    expect(err).to.not.be.an('error')
    fixtures(emitter)
    done()
  })
  newInventoryDB(emitter, opts)
}

describe('inventory-db', () => {
  _.each(t.inventoryDBFails, ({opts, error}) => {
    it('fails to create inventory db', done => {
      const emitter = new AsyncEmitter()
      emitter.once('ready', err => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      })
      newInventoryDB(emitter, opts)
    })
  })

  it('tests mongodb', done => testDB(mongodbOpts, done))
  it('tests postgresql', done => testDB(postgresqlOpts, done))
  it('tests redis', done => testDB(redisOpts, done))
})
