'use strict'

const chai = require('chai')
const assert = require('assert')

const Name = require('./../lib/data/name')
const Location = require('./../lib/data/location')
const Unit = require('./../lib/data/unit')
const Edge = require('./../lib/data/edge')
const DiplomacyMap = require('./../lib/data/diplomacy-map')
const Order = require('./../lib/variant/standard/order')
const Variant = require('./../lib/variant')

chai.should()

describe('Variant', () => {
  it('defines helper functions.', () => {
    const fleet = new Name('Fleet', 'F')
    const army = new Name('Army', 'A')

    const spain = new Name('Spa')
    const spa = new Location(spain, [army])
    const spaSc = new Location(spain, [fleet])

    const naples = new Name('Nap')
    const nap = new Location(naples, [army, fleet])

    const apulia = new Name('Apu')
    const apu = new Location(apulia, [army, fleet])

    const western = new Name('Wes')
    const wes = new Location(western, [fleet])

    const map = new DiplomacyMap(
      [new Edge(spaSc, wes, [fleet]), new Edge(wes, nap, [fleet]), new Edge(nap, apu, [army])]
    )

    const orders = []
    for (const name in Order) {
      orders.push({name: name.toLowerCase(), Clazz: Order[name]})
    }

    const v = new Variant([fleet, army], [new Name('SC')], orders, map)
    v.generateLocation = (province, arg) => {
      switch (province.abbreviatedName) {
        case 'Nap': return nap
        case 'Apu': return apu
        case 'Wes': return wes
        case 'Spa': return (arg && arg.abbreviatedName === 'SC') ? spaSc : spa
      }
    }

    v.$$.Nap().should.deep.equal(nap)
    v.$$.Spa().should.deep.equal(spa)
    v.$$.Spa(v.$$.SC).should.deep.equal(spaSc)

    v.F(v.$$.Nap()).militaryBranch.should.deep.equal(fleet)
    v.F(v.$$.Nap()).location.should.deep.equal(nap)

    const c = v.F(v.$$.Wes()).convoy(v.A(v.$$.Nap()).move(v.$$.Spa()).viaConvoy())

    c.unit.militaryBranch.should.deep.equal(fleet)
    c.unit.location.should.deep.equal(v.$$.Wes())
    c.target.unit.militaryBranch.should.deep.equal(army)
    c.target.unit.location.should.deep.equal(v.$$.Nap())
    c.target.destination.should.deep.equal(v.$$.Spa())
    c.target.isViaConvoy.should.equal(true)
  })
})
