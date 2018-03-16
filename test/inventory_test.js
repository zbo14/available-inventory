'use strict'

/* eslint-env node, es6 */

const {describe} = require('mocha')
const {newInventory} = require('../src')
const testOps = require('./fixtures')

describe('inventory', () => testOps(newInventory()))
