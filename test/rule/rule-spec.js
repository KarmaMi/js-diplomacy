'use strict'

const chai = require('chai')
const assert = require('assert')

const Name = require('./../../lib/data/name')
const Location = require('./../../lib/data/location')
const Province = require('./../../lib/data/province')
const Rule = require('./../../lib/rule/rule')
const RuleHelper = require('./../../lib/rule/rule-helper')
const Order = require('./../../lib/variant/standard/order')

chai.should()

describe('Rule', () => {
  describe('when one unit has several order', () => {
    it('returns null', () => {
      const army = new Name('Army', 'A')
      const spa_ = new Province(new Name('Spa'), null, true)
      const spa = new Location(spa_, [army])

      const mar_ = new Province(new Name('Mar'), 'France', true)
      const mar = new Location(mar_, [army])

      const orders = []
      for (const name in Order) {
        orders.push([name.toLowerCase(), Order[name]])
      }

      const rule = new Rule([], [], [], [army], orders, (map, board, os) => {})

      const $ = new RuleHelper(rule)

      const result = rule.resolve(null, { units: [] }, [$.A(mar).move(spa), $.A(mar).hold()]);

      (result == null).should.equal(true)
    })
  })
  describe('when there are invalid orders', () => {
    it('uses a default order.', () => {
      const army = new Name('Army', 'A')
      const spa_ = new Province(new Name('Spa'), null, true)
      const spa = new Location(spa_, [army])

      const mar_ = new Province(new Name('Mar'), 'France', true)
      const mar = new Location(mar_, [army])

      const orders = []
      for (const name in Order) {
        orders.push([name.toLowerCase(), Order[name]])
      }

      let result = null
      const rule = new Rule([], [], [], [army], orders)
      const $ = new RuleHelper(rule)

      rule._resolveOrder = (map, board, os) => { result = os }
      rule.getErrorMessageForOrder = (map, board, order) => (order.type === 'Hold') ? null : 'invalid'
      rule.defaultOrder = (map, board, unit) => $.A(unit.location).hold()

      rule.resolve(null, { units: [] }, [$.A(mar).move(spa), $.A(spa).hold()])

      result.length.should.equal(2)
      result[0].type.should.equal('Hold')
      result[1].type.should.equal('Hold')
    })
  })
})
