'use strict'

const chai = require('chai')
const assert = require('assert')

const Name = require('./../../lib/data/name')
const Location = require('./../../lib/data/location')

chai.should()

describe('Location', () => {
  it('has a province.', () => {
    const Fleet = new Name('Fleet', 'F')
    const Army = new Name('Army', 'A')
    const location = new Location(new Name('Sweden', 'Swe'), [Fleet, Army])

    location.province.should.deep.equal(new Name('Sweden', 'Swe'))
  })
  it('has the set of the military branches that can enter this location.', () => {
    const Fleet = new Name('Fleet', 'F')
    const location = new Location(new Name('Spain', 'Spa'), [Fleet]);

    ([...location.militaryBranches]).should.deep.equals([Fleet])
  })
})
