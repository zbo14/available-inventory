'use strict'

/* eslint-env node, es6 */

const {describe, it} = require('mocha')
const {expect} = require('chai')
const {newInventory} = require('../src')
const AsyncEmitter = require('../src/async-emitter')
const fixtures = require('./fixtures')

describe('inventory', () => {
  it('memory', done => {
    const emitter = new AsyncEmitter()
    emitter.once('ready', err => {
      expect(err).to.not.be.an('error')
      fixtures(emitter)
      done()
    })
    newInventory(emitter)
  })
})
