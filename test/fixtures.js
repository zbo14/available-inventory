'use strict'

/* eslint-env node, es6 */

const {describe} = require('mocha')
const {expect} = require('chai')
const {it} = require('mocha')
const t = require('./testcases')
const _ = require('../src/util')

const sharedResults = (results, entries) => {
  return _.filter(results, result => _.find(entries, entry => entry.date === result.date))
}

module.exports = emitter => {
  describe('fixtures', () => {
    _.each(t.cases, ({entries, available, begin, end}) => {
      _.each(entries, entry => {
        it('updates entry', done => {
          emitter.once('updatedEntry', done)
          emitter.emit('updateEntry', entry)
        })

        it('checks entry', done => {
          emitter.once('gotEntry', (err, result) => {
            expect(err).to.not.be.an('error')
            expect(result).to.deep.equal(entry)
            done()
          })
          emitter.emit('getEntry', entry.date)
        })
      })

      it('updates entries', done => {
        emitter.once('updatedEntries', done)
        emitter.emit('updateEntries', entries)
      })

      it('checks entries', done => {
        emitter.once('gotEntries', (err, results) => {
          expect(err).to.not.be.an('error')
          const newEntries = entries.slice(begin, end)
          const newResults = sharedResults(results, newEntries)
          _.zipWith(newResults, newEntries, (result, entry) => expect(result).to.deep.equal(entry))
          done()
        })
        emitter.emit('getEntries', begin, end)
      })

      it('gets available emitter', done => {
        emitter.once('gotAvailable', (err, result) => {
          expect(err).to.not.be.an('error')
          expect(result).to.deep.equal(available)
          done()
        })
        emitter.emit('getAvailable', begin, end)
      })
    })

    it('fails to get entry', done => {
      const {error, date} = t.getEntryFail
      emitter.once('gotEntry', (err, entry) => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        expect(entry).to.equal(undefined)
        done()
      })
      emitter.emit('getEntry', date)
    })

    _.each(t.getEntriesFails, ({begin, end, error}) => {
      it('fails to get entries', done => {
        emitter.once('gotEntries', (err, entries) => {
          expect(err).to.be.an('error')
          expect(err.message).to.equal(error.message)
          expect(entries).to.equal(undefined)
          done()
        })
        emitter.emit('getEntries', begin, end)
      })
    })

    _.each(t.updateEntryFails, ({entry, error}) => {
      it('fails to update entry', done => {
        emitter.once('updatedEntry', err => {
          expect(err).to.be.an('error')
          expect(err.message).to.equal(error.message)
          done()
        })
        emitter.emit('updateEntry', entry)
      })

      it('fails to update entries', done => {
        emitter.once('updatedEntries', err => {
          expect(err).to.be.an('error')
          expect(err.message).to.equal(error.message)
          done()
        })
        emitter.emit('updateEntries', [entry])
      })
    })

    it('fails to update entries', done => {
      const {entries, error} = t.updateEntriesFail
      emitter.once('updatedEntries', err => {
        expect(err).to.be.an('error')
        expect(err.message).to.equal(error.message)
        done()
      })
      emitter.emit('updateEntries', entries)
    })
  })
}
