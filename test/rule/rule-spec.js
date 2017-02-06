'use strict'

const chai = require('chai')

const mockMap = require('../mock/map')
const MockOrder = require('../mock/order')
const MockRule = require('./../mock/rule')

const { Unit, Board } = require('./../../lib/board/package')
const ResolvedResult = require('./../../lib/rule/resolved-result')
const { Executed, Replaced } = require('./../../lib/rule/order-result')

chai.should()

describe('A rule', () => {
  const [Army, Fleet] = mockMap.militaryBranches
  const [spain, naples, apulia, western] = mockMap.provinces
  const [spa, spaSc, nap, apu, wes] = mockMap.locations
  const map = mockMap.map
  const unit = new Unit(Fleet, nap, 'France')
  const board = new Board(map, 'State', [unit], [], [])

  describe('when one unit has several orders', () => {
    it('does not resolve orders.', () => {
      const rule = new MockRule()
      rule.resolve(board, [new MockOrder(unit), new MockOrder(unit)]).should.deep.equal({
        err: 'F Nap: several orders'
      })
    })
  })
  describe('when resolving an invalid order', () => {
    it('uses a default order', () => {
      const unit1 = new Unit(Fleet, nap, 'France')
      const unit2 = new Unit(Army, spa, 'France')
      const board = new Board(null, 'State', [unit1, unit2], [], [])

      const rule = new MockRule()
      rule.errorMessageOfOrder = (board, order) => {
        return (order.unit === unit1 || order.replaced) ? null : 'Invalid'
      }
      rule.defaultOrderOf = (board, unit) => {
        const o = new MockOrder(unit)
        o.replaced = true
        return o
      }
      rule.resolveProcedure = (board, orders) => {
        return {
          result: new ResolvedResult(
            board,
            orders.map(order => new Executed(order, 'Resolved')),
            true
          )
        }
      }

      const results = rule.resolve(board, [new MockOrder(unit1), new MockOrder(unit2)]).result.results

      const tmp = new MockOrder(unit2)
      tmp.replaced = true
      results.should.deep.equal(new Set([
        new Executed(new MockOrder(unit1), 'Resolved'),
        new Replaced(new MockOrder(unit2), 'Invalid', tmp, 'Resolved')
      ]))
    })
  })
  describe('when the set of orders are invalid', () => {
    it('does not resolve the orders', () => {
      const rule = new MockRule()
      rule.errorMessageOfOrders = (board, orders) => 'Invalid'
      rule.resolve(board, [new MockOrder(unit)]).should.deep.equal({
        err: 'Invalid'
      })
    })
  })
  describe('when several unit that require an order do not have orders', () => {
    it('uses a default order.', () => {
      const unit1 = new Unit(Fleet, nap, 'France')
      const unit2 = new Unit(Army, spa, 'France')
      const board = new Board(null, 'State', [unit1, unit2], [], [])

      const rule = new MockRule()
      rule.unitsRequiringOrder = (board) => board.units
      rule.defaultOrderOf = (board, unit) => {
        const o = new MockOrder(unit)
        return o
      }
      rule.resolveProcedure = (board, orders) => {
        return {
          result: new ResolvedResult(
            board,
            orders.map(order => new Executed(order, 'Resolved')),
            true
          )
        }
      }
      const result = rule.resolve(board, []).result.results
      result.should.deep.equal(new Set([
        new Executed(new MockOrder(unit1), 'Resolved'),
        new Executed(new MockOrder(unit2), 'Resolved')
      ]))
    })
  })
})
