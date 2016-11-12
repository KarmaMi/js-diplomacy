'use strict'

const chai = require('chai')
const assert = require('assert')

const Name = require('./../../lib/data/name')
const Location = require('./../../lib/data/location')
const Province = require('./../../lib/data/province')
const Rule = require('./../../lib/rule/rule')
const RuleKeywords = require('./../../lib/rule/rule-keywords')
const RuleKeywordsHelper = require('./../../lib/rule/rule-keywords-helper')
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

      const ruleKeywords = new RuleKeywords([], [], [], [army], orders, (map, board, os) => {})
      const $ = RuleKeywordsHelper(ruleKeywords)
      const rule = new Rule()

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

      const ruleKeywords = new RuleKeywords([], [], [], [army], orders, (map, board, os) => {})
      const $ = RuleKeywordsHelper(ruleKeywords)
      const rule = new Rule()

      rule._resolveOrder = (map, board, os) => {
        return { orderResult: os.map(order => [order, 'result']) }
      }
      rule.getUnitsRequiringOrder = (map, board) => []
      rule.getErrorMessageForOrder = (map, board, order) => (order.type === 'Hold') ? null : 'invalid'
      rule.getErrorMessageForOrders = (map, board, orders) => null
      rule.defaultOrder = (map, board, unit) => $.A(unit.location).hold()

      const result = [...rule.resolve(null, { units: [] }, [$.A(mar).move(spa)]).orderResult]

      result.length.should.equal(1)
      result[0][0].type.should.equal('Move')
      result[0][1].replacedBy.type.should.equal('Hold')
    })
  })
  describe('when orders are invalid', () => {
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

      const ruleKeywords = new RuleKeywords([], [], [], [army], orders, (map, board, os) => {})
      const $ = RuleKeywordsHelper(ruleKeywords)
      const rule = new Rule()

      rule._resolveOrder = (map, board, os) => {}
      rule.getErrorMessageForOrder = (map, board, order) => (order.type === 'Hold') ? null : 'invalid'
      rule.getErrorMessageForOrders = (map, board, orders) => 'error'
      rule.defaultOrder = (map, board, unit) => $.A(unit.location).hold()

      const result = rule.resolve(null, { units: [] }, [$.A(mar).move(spa), $.A(mar).hold()]);

      (result == null).should.equal(true)
    })
  })
  describe('when some units that require order do not have order', () => {
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

      const ruleKeywords = new RuleKeywords([], [], [], [army], orders, (map, board, os) => {})
      const $ = RuleKeywordsHelper(ruleKeywords)
      const rule = new Rule()
      let result = null

      rule._resolveOrder = (map, board, os) => { result = os }
      rule.getUnitsRequiringOrder = (map, board) => [$.A(mar)]
      rule.getErrorMessageForOrder = (map, board, order) => null
      rule.getErrorMessageForOrders = (map, board, orders) => null
      rule.defaultOrder = (map, board, unit) => $.A(unit.location).hold()

      rule.resolve(null, { units: [] }, [])

      result.length.should.equal(1)
      result[0].type.should.equal('Hold')
    })
  })
})
