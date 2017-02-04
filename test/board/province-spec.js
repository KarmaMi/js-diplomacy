'use strict'

const chai = require('chai')

const Name = require('./../../lib/board/name')
const Province = require('./../../lib/board/province')

chai.should()

describe('Province', () => {
  describe('if the province is supply center', () => {
    it('adds *.', () => {
      const prov = new Province(new Name('Lvp'), 'England', true)

      prov.toString().should.equal('Lvp*')
      prov.homeOf.should.equal('England')
    })
  })
})
