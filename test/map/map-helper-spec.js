'use strict'

const chai = require('chai')
const assert = require('assert')

const Name = require('./../../lib/data/name')
const Province = require('./../../lib/data/province')
const Location = require('./../../lib/data/location')
const Edge = require('./../../lib/map/edge')
const DiplomacyMap = require('./../../lib/map/diplomacy-map')
const MapHelper = require('./../../lib/map/map-helper')

chai.should()

describe('MapHelper', () => {
  it('defines helper functions.', () => {
    const fleet = new Name('Fleet', 'F')
    const army = new Name('Army', 'A')

    const mar_ = new Province(new Name('Mar'), null, true)
    const mar = new Location(mar_, [army, fleet])

    const spain = new Province(new Name('Spa'), null, true)
    const spa = new Location(spain, [army])
    const spaSc = new Location(spain, [fleet])
    spaSc.toString = () => 'Spa/SC'

    const naples = new Province(new Name('Nap'), 'Italy')
    const nap = new Location(naples, [army, fleet])

    const apulia = new Province(new Name('Apu'), 'Italy')
    const apu = new Location(apulia, [army, fleet])

    const western = new Province(new Name('Wes'))
    const wes = new Location(western, [fleet])

    const map = new DiplomacyMap(
      [
        new Edge(mar, spa, [army, fleet]), new Edge(spaSc, wes, [fleet]),
        new Edge(wes, nap, [fleet]), new Edge(nap, apu, [army])
      ]
    )

    const h = new MapHelper(map)
    h.$l.Nap.should.deep.equal(nap)
    h.$l['Spa/SC'].should.deep.equal(spaSc)

    h.$f.Italy.should.equal('Italy')
  })
})
