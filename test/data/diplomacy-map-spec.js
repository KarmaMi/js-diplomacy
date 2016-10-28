'use strict'

const chai = require('chai')
const assert = require('assert')

const Name = require('./../../lib/data/name')
const Location = require('./../../lib/data/location')
const Unit = require('./../../lib/data/unit')
const Edge = require('./../../lib/data/edge')
const DiplomacyMap = require('./../../lib/data/diplomacy-map')

chai.should()

describe('DiplomacyMap', () => {
  it('returns locations that an unit can move to.', () => {
    const Fleet = new Name('Fleet', 'F')
    const Army = new Name('Army', 'A')

    const spain = new Name('Spa')
    const spa = new Location(spain, [Army])
    const spaSc = new Location(spain, [Fleet])

    const naples = new Name('Nap')
    const nap = new Location(naples, [Army, Fleet])

    const apulia = new Name('Apu')
    const apu = new Location(apulia, [Army, Fleet])

    const western = new Name('Wes')
    const wes = new Location(western, [Fleet])

    const edges = [
      new Edge(spaSc, wes, [Fleet]), new Edge(wes, nap, [Fleet]), new Edge(nap, apu, [Army])
    ]

    const map = new DiplomacyMap(edges);

    ([...map.canMoveTo(new Unit(Army, spa))]).should.deep.equal([]);
    ([...map.canMoveTo(new Unit(Fleet, spaSc))]).should.deep.equal([wes]);
    ([...map.canMoveTo(new Unit(Fleet, apu))]).should.deep.equal([])
  })
})
