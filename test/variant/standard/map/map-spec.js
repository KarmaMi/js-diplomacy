'use strict'

const chai = require('chai')

const { Army, Fleet } = require('./../../../../lib/variant/standard/rule/package').MilitaryBranch
const $ = require('./../../../../lib/variant/standard/map/location')
const map = require('./../../../../lib/variant/standard/map/map')

chai.should()

describe('Map', () => {
  it('defines a map (1).', () => {
    $.Pic.province.isSupplyCenter.should.equal(false)
    $.Pic.province.homeOf.should.equal('France')
    $.Bre.province.isSupplyCenter.should.equal(true)
    $.Bre.province.homeOf.should.equal('France')
    $.Bur.province.isSupplyCenter.should.equal(false)
    $.Bur.province.homeOf.should.equal('France')
    $.Gas.province.isSupplyCenter.should.equal(false)
    $.Gas.province.homeOf.should.equal('France')

    const provinces = map.movableProvincesOf($.Par.province, Army)

    provinces.size.should.equal(4)
    provinces.should.deep.equal(
      new Set([$.Pic.province, $.Bre.province, $.Bur.province, $.Gas.province])
    )
  })
  it('defines a map (2).', () => {
    ($.Iri.province.homeOf == null).should.equal(true)
    $.Iri.province.isSupplyCenter.should.equal(false)
    $.Wal.province.homeOf.should.equal('England')

    const provinces = map.movableProvincesOf($.Eng.province, Fleet)

    provinces.should.deep.equal(
      new Set([
        $.Iri.province, $.Wal.province, $.Lon.province, $.Nth.province, $.Bel.province,
        $.Pic.province, $.Bre.province, $.Mid.province
      ])
    )
  })
  it('defines a map (3).', () => {
    const provinces = map.movableProvincesOf($.Rom.province, Fleet)

    provinces.size.should.equal(3)
    provinces.should.deep.equal(new Set([
      $.Tus.province, $.Nap.province, $.Tyn.province
    ]))
  })
})
