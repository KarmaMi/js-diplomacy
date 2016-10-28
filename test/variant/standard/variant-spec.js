'use strict'

const chai = require('chai')
const assert = require('assert')

const $ = require('./../../../lib/variant/standard/variant')

chai.should()

describe('Variant', () => {
  it('defines a map (1).', () => {
    const provinces = $.map.canMoveTo($.A($.Par()))

    provinces.size.should.equal(4)
    provinces.has($.Pic()).should.equal(true)
    provinces.has($.Bre()).should.equal(true)
    provinces.has($.Bur()).should.equal(true)
    provinces.has($.Gas()).should.equal(true)
  })
  it('defines a map (2).', () => {
    const provinces = $.map.canMoveTo($.F($.Eng()))

    provinces.size.should.equal(8)
    provinces.has($.Iri()).should.equal(true)
    provinces.has($.Wal()).should.equal(true)
    provinces.has($.Lon()).should.equal(true)
    provinces.has($.Nth()).should.equal(true)
    provinces.has($.Bel()).should.equal(true)
    provinces.has($.Pic()).should.equal(true)
    provinces.has($.Bre()).should.equal(true)
    provinces.has($.Mid()).should.equal(true)
  })
  it('defines a map (3).', () => {
    const provinces = $.map.canMoveTo($.F($.Rom()))

    provinces.size.should.equal(3)
    provinces.has($.Tus()).should.equal(true)
    provinces.has($.Nap()).should.equal(true)
    provinces.has($.Tyn()).should.equal(true)
  })
})
