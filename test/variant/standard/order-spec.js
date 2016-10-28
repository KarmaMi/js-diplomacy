'use strict'

const chai = require('chai')
const assert = require('assert')

const Name = require('./../../../lib/data/name')
const Location = require('./../../../lib/data/location')
const Unit = require('./../../../lib/data/unit')
const Order = require('./../../../lib/variant/standard/order')

chai.should()

const fleet = new Name('Fleet', 'F')
const army = new Name('Army', 'A')

describe('Order', () => {
  it('generates a Hold order.', () => {
    const h = new Order.Hold(new Unit(fleet, new Location(new Name('Eng'), [fleet])))
    h.toString().should.equal('F Eng H')
  })
  it('generates a Move order.', () => {
    const m =
      new Order.Move(new Unit(fleet, new Location(new Name('Eng'), [fleet])), new Name('Nth'))
    m.toString().should.equal('F Eng-Nth')
  })
  it('generates a Support order.', () => {
    const s = new Order.Support(
      new Unit(fleet, new Location(new Name('Eng'), [fleet])),
      new Order.Hold(new Unit(fleet, new Location(new Name('Nth'), [fleet])))
    )
    s.toString().should.equal('F Eng S F Nth H')
  })
  it('generates a Convoy order.', () => {
    const c =
      new Order.Convoy(
        new Unit(fleet, new Location(new Name('Nth'), [fleet])),
        new Order.Move(
          new Unit(army, new Location(new Name('Yor'), [army, fleet])),
          new Location(new Name('Bel'), [army, fleet]),
          true
        )
      )
    c.toString().should.equal('F Nth C A Yor-Bel via convoy')
  })
  it('generates a Retreat order.', () => {
    const r = new Order.Retreat(
      new Unit(fleet, new Location(new Name('Nth'), [fleet])), new Location(new Name('Yor'), [fleet, army])
    )
    r.toString().should.equal('F Nth R Yor')
  })
  it('generates a Disband order.', () => {
    const d = new Order.Disband(new Unit(fleet, new Location(new Name('Nth'), [fleet])))
    d.toString().should.equal('Dispand F Nth')
  })
  it('generates a Build order.', () => {
    const b = new Order.Build(new Unit(fleet, new Location(new Name('Lon'), [fleet, army])))
    b.toString().should.equal('Build F Lon')
  })
})
