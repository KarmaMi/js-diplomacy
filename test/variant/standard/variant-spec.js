'use strict'

const chai = require('chai')
const assert = require('assert')

const standard = require('./../../../lib/variant/standard/variant')
const $ = standard.helper()

chai.should()

describe('Variant', () => {
  it('defines an initial board.', () => {
    standard.initialBoard.numberOfsupplyCenters($.Russia).should.equal(4)
    standard.initialBoard.units.get($.Russia).length.should.equal(4)
  })
})
