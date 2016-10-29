'use strict'

const chai = require('chai')
const assert = require('assert')

const Name = require('./../../lib/data/name')
const Province = require('./../../lib/data/province')

chai.should()

describe('Province', () => {
  it('has a flag whether this province is supply cener or not.', () => {
    const prov = new Province(new Name('Lvp'), 'England', true)

    prov.toString().should.equal('Lvp*')
    prov.homeOf.should.equal('England')
  })
})
