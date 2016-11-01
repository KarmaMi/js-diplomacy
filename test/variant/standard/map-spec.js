'use strict'

const chai = require('chai')
const assert = require('assert')

const Helper = require('./../../../lib/variant/helper')

const rule = require('./../../../lib/variant/standard/rule')
const map = require('./../../../lib/variant/standard/map')
const $ = new Helper(rule, map)

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

    const provinces = map.canMoveTo($.A($.Par))

    provinces.size.should.equal(4)
    provinces.has($.Pic).should.equal(true)
    provinces.has($.Bre).should.equal(true)
    provinces.has($.Bur).should.equal(true)
    provinces.has($.Gas).should.equal(true)
  })
  it('defines a map (2).', () => {
    ($.Iri.province.homeOf == null).should.equal(true)
    $.Iri.province.isSupplyCenter.should.equal(false)
    $.Wal.province.homeOf.should.equal('England')

    const provinces = map.canMoveTo($.F($.Eng))

    provinces.size.should.equal(8)
    provinces.has($.Iri).should.equal(true)
    provinces.has($.Wal).should.equal(true)
    provinces.has($.Lon).should.equal(true)
    provinces.has($.Nth).should.equal(true)
    provinces.has($.Bel).should.equal(true)
    provinces.has($.Pic).should.equal(true)
    provinces.has($.Bre).should.equal(true)
    provinces.has($.Mid).should.equal(true)
  })
  it('defines a map (3).', () => {
    const provinces = map.canMoveTo($.F($.Rom))

    provinces.size.should.equal(3)
    provinces.has($.Tus).should.equal(true)
    provinces.has($.Nap).should.equal(true)
    provinces.has($.Tyn).should.equal(true)
  })
})
