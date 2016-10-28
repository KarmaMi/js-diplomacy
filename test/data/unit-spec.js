'use strict'

const chai = require('chai')
const assert = require('assert')

const Name = require('./../../lib/data/name')
const Location = require('./../../lib/data/location')
const Unit = require('./../../lib/data/unit')

chai.should()

describe('Unit', () => {
  it('contains its location and military-branch.', () => {
    const fleet = new Name('Fleet', 'F')
    const location = new Location(new Name('Sweden', 'Swe'), [fleet])
    const unit = new Unit(fleet, location)

    unit.toString().should.equal('F Swe')
  })
})
