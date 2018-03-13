'use strict'

/* eslint-env node, es6 */

const {expect} = require('chai')
const {it} = require('mocha')
const t = require('./testcases')
const _ = require('../src/util')

const sharedResults = (results, entries) => {
  return _.filter(results, result => _.find(entries, entry => entry.date === result.date))
}

module.exports = inventory => {
  _.each(t.cases, ({entries, available, start, end}) => {
    _.each(entries, entry => {
      it('updates entry', done => {
        inventory.once('updatedEntry', done)
        inventory.emit('updateEntry', entry)
      })

      it('checks entry', done => {
        inventory.once('gotEntry', result => {
          expect(result).to.deep.equal(entry)
          done()
        })
        inventory.emit('getEntry', entry.date)
      })
    })

    it('updates entries', done => {
      inventory.once('updatedEntries', done)
      inventory.emit('updateEntries', entries)
    })

    it('checks entries', done => {
      inventory.once('gotEntries', results => {
        const newEntries = entries.slice(start, end)
        const newResults = sharedResults(results, newEntries)
        _.zipWith(newResults, newEntries, (result, entry) => expect(result).to.deep.equal(entry))
        done()
      })
      inventory.emit('getEntries', start, end)
    })

    it('gets available inventory', done => {
      inventory.once('gotAvailable', result => {
        expect(result).to.deep.equal(available)
        done()
      })
      inventory.emit('getAvailable', start, end)
    })
  })

  _.each(t.getEntryFails, ({date, error}) => {
    it('fails to get entry', done => {
      inventory.once('error', err => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      })
      inventory.emit('getEntry', date)
    })
  })

  _.each(t.getEntriesFails, ({start, end, error}) => {
    it('fails to get entries', done => {
      inventory.once('error', err => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      })
      inventory.emit('getEntries', start, end)
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

    it('fails to update entries', done => {
      inventory.once('error', err => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      })
      inventory.emit('updateEntries', [entry])
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
