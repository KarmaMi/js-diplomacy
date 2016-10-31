'use strict'

const chai = require('chai')
const assert = require('assert')

const Name = require('./../../lib/data/name')
const Location = require('./../../lib/data/location')
const Edge = require('./../../lib/data/edge')
const Province = require('./../../lib/data/province')
const DiplomacyMap = require('./../../lib/data/diplomacy-map')
const Helper = require('./../../lib/variant/helper')
const Order = require('./../../lib/variant/standard/order')

chai.should()

describe('Helper', () => {
  it('defines helper functions.', () => {
    const fleet = new Name('Fleet', 'F')
    const army = new Name('Army', 'A')

    const mar_ = new Province(new Name('Mar'), null, true)
    const mar = new Location(mar_, [army, fleet])

    const spain = new Province(new Name('Spa'), null, true)
    const spa = new Location(spain, [army])
    const spaSc = new Location(spain, [fleet])
    spaSc.toString = () => 'Spa/SC'

    const naples = new Province(new Name('Nap'))
    const nap = new Location(naples, [army, fleet])

    const apulia = new Province(new Name('Apu'))
    const apu = new Location(apulia, [army, fleet])

    const western = new Province(new Name('Wes'))
    const wes = new Location(western, [fleet])

    const map = new DiplomacyMap(
      [
        new Edge(mar, spa, [army, fleet]), new Edge(spaSc, wes, [fleet]),
        new Edge(wes, nap, [fleet]), new Edge(nap, apu, [army])
      ]
    )

    const orders = []
    for (const name in Order) {
      orders.push([name.toLowerCase(), Order[name]])
    }

    const h = new Helper([], [], [fleet, army], orders, map)
    h.$l.Nap.should.deep.equal(nap)
    h.$l['Spa/SC'].should.deep.equal(spaSc)

    h.$m.F(h.$l.Nap).militaryBranch.should.deep.equal(fleet)
    h.$m.F(h.$l.Nap).location.should.deep.equal(nap)

    const c = h.F(h.Wes).convoy(h.A(h.Nap).move(h.Spa).viaConvoy())

    c.unit.militaryBranch.should.deep.equal(fleet)
    c.unit.location.should.deep.equal(h.Wes)
    c.target.unit.militaryBranch.should.deep.equal(army)
    c.target.unit.location.should.deep.equal(h.Nap)
    c.target.destination.should.deep.equal(h.Spa)
    c.target.isViaConvoy.should.equal(true)
  })
})
