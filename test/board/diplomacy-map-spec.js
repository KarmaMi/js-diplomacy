'use strict'

const chai = require('chai')

const mockMap = require('../mock/map')

chai.should()

describe('DiplomacyMap', () => {
  const [Army, Fleet] = mockMap.militaryBranches
  const [spain, naples, apulia, western] = mockMap.provinces
  const [spa, spaSc, nap, apu, wes] = mockMap.locations
  const map = mockMap.map

  it('returns locations that belong to an province', () => {
    map.locationsOf(spain).should.deep.equal(new Set([spaSc]))
  })
  it('returns provinces that an unit in the province can move to.', () => {
    map.movableProvincesOf(spain, Fleet).should.deep.equal(new Set([western]))
  })
  it('returns locations that an unit can move to.', () => {
    map.movableLocationsOf(spa, Army).should.deep.equal(new Set([]))
    map.movableLocationsOf(spaSc, Fleet).should.deep.equal(new Set([wes]))
    map.movableLocationsOf(apu, Fleet).should.deep.equal(new Set())
  })
})
