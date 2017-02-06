'use strict'

const chai = require('chai')

const { Board, Unit } = require('../../../../lib/board/package')
const { map, location, Power } = require('../../../../lib/variant/standard/map/package')
const { Turn, Season } = require('../../../../lib/variant/standard/board/package')
const { Army, Fleet } = require('../../../../lib/variant/standard/rule/military-branch')
const { Retreat } = require('../../../../lib/variant/standard/rule/phase')
const Order = require('../../../../lib/variant/standard/rule/order')
const Dislodged = require('../../../../lib/variant/standard/rule/dislodged')
const ProvinceStatus = require('../../../../lib/variant/standard/rule/province-status')
const State = require('../../../../lib/variant/standard/rule/state')
const RetreatValidator = require('../../../../lib/variant/standard/rule/retreat-validator')
const Helper = require('../../../../lib/variant/standard/rule/standard-rule-helper')

chai.should()

const $ = location
const validator = new RetreatValidator()

describe('A RetreatValidator', () => {
  const u1 = new Unit(Army, $.Bur, Power.France)
  const u2 = new Unit(Army, $.Mar, Power.France)
  const u3 = new Unit(Fleet, $.Wes, Power.Italy)
  const board = new Board(
    map, new State(new Turn(1901, Season.Autumn), Retreat),
    [u1, u2, u3],
    [
      [u2, new Dislodged($.Gas.province)], [u3, new Dislodged($.Tyn.province)]
    ],
    [[$.Pie.province, new ProvinceStatus(null, true)]]
  )
  const $$ = new Helper(board)
  describe('when a valid order is received', () => {
    it('returns null (1)', () => {
      (validator.errorMessageOfOrder(board, $$.A($.Mar).retreat($.Spa)) === null).should.equal(true)
    })
    it('returns null (2)', () => {
      (validator.errorMessageOfOrder(board, $$.A($.Mar).disband()) === null).should.equal(true)
    })
    describe('an order that its target is not dislodged is received', () => {
      it('returns an error message', () => {
        validator.errorMessageOfOrder(board, new Order.Disband(u1)).should.deep.equal(
          `A Bur is not dislodged`
        )
      })
    })
    describe('an order that its target retreats to an invalid location', () => {
      it('returns an error message', () => {
        validator.errorMessageOfOrder(board, $$.A($.Mar).retreat($.Gas)).should.deep.equal(
          `A Mar cannot retreat to Gas`
        )
      })
    })
    describe('a set of orders that some dislodged unit have no order', () => {
      it('returns an error message', () => {
        validator.errorMessageOfOrders(board, [$$.A($.Mar).retreat($.Gas)]).should.deep.equal(
          `F Wes has no order`
        )
      })
    })
  })
})
