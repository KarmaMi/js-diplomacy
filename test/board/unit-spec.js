'use strict'

const chai = require('chai')

const Name = require('./../../lib/board/name')
const Province = require('./../../lib/board/province')
const Location = require('./../../lib/board/location')
const Unit = require('./../../lib/board/unit')

chai.should()

describe('Unit', () => {
  it('contains its location and military-branch.', () => {
    const fleet = new Name('Fleet', 'F')
    const location =
      new Location(new Name('Sweden', 'Swe'), new Province(new Name('Sweden', 'Swe')), [fleet])
    const unit = new Unit(fleet, location, 'Russia')

    unit.toString().should.equal('F Swe')
  })
})
