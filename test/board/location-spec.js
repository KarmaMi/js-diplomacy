'use strict'

const chai = require('chai')

const Name = require('./../../lib/board/name')
const Location = require('./../../lib/board/location')

chai.should()

describe('Location', () => {
  it('has a province.', () => {
    const Fleet = new Name('Fleet', 'F')
    const Army = new Name('Army', 'A')
    const location = new Location(new Name('Sweden', 'Swe'), new Name('Sweden', 'Swe'), [Fleet, Army])

    location.province.should.deep.equal(new Name('Sweden', 'Swe'))
  })
  it('has the set of the military branches that can enter this location.', () => {
    const Fleet = new Name('Fleet', 'F')
    const location = new Location(new Name('Spain', 'Spa'), new Name('Spain', 'Spa'), [Fleet])

    location.militaryBranches.should.deep.equals(new Set([Fleet]))
  })
})
