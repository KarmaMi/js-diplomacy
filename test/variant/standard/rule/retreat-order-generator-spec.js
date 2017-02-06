'use strict'

const chai = require('chai')

const { Board, Unit } = require('../../../../lib/board/package')
const { map, location, Power } = require('../../../../lib/variant/standard/map/package')
const { Turn, Season } = require('../../../../lib/variant/standard/board/package')
const { Army, Fleet } = require('../../../../lib/variant/standard/rule/military-branch')
const { Retreat } = require('../../../../lib/variant/standard/rule/phase')
const Dislodged = require('../../../../lib/variant/standard/rule/dislodged')
const ProvinceStatus = require('../../../../lib/variant/standard/rule/province-status')
const State = require('../../../../lib/variant/standard/rule/state')
const RetreatOrderGenerator = require('../../../../lib/variant/standard/rule/retreat-order-generator')
const Helper = require('../../../../lib/variant/standard/rule/standard-rule-helper')

chai.should()

const $ = location
const generator = new RetreatOrderGenerator()

describe('A RetreatOrderGenerator', () => {
  it('uses Disband as a default order', () => {
    const u1 = new Unit(Army, $.Mar, Power.France)
    const u2 = new Unit(Fleet, $.Wes, Power.Italy)
    const board = new Board(
      map, new State(new Turn(1901, Season.Spring), Retreat),
      [
        new Unit(Army, $.Bur, Power.France),
        u1,
        u2
      ],
      [
        [u1, new Dislodged($.Gas.province)], [u2, new Dislodged($.Tyn.province)]
      ],
      [[$.Pie.province, new ProvinceStatus(null, true)]]
    )
    const $$ = new Helper(board)
    generator.defaultOrderOf(board, $$.A($.Mar).unit).should.deep.equal($$.A($.Mar).disband())
    generator.defaultOrderOf(board, $$.F($.Wes).unit).should.deep.equal($$.F($.Wes).disband())
  })
  describe('when all dislodged units cannot retreat', () => {
    it('uses disband orders to skip the retreat phase', () => {
      const u1 = new Unit(Army, $.Bre, Power.France)
      const board = new Board(
        map, new State(new Turn(1901, Season.Spring), Retreat),
        [
          new Unit(Army, $.Par, Power.Germany),
          new Unit(Army, $.Gas, Power.Germany),
          new Unit(Army, $.Bre, Power.Germany),
          u1
        ],
        [[u1, new Dislodged($.Pic.province)]],
        []
      )
      const $$ = new Helper(board)
      generator.ordersToSkipPhase(board).should.deep.equal(new Set([$$.A($.Bre).disband()]))
    })
  })
  describe('there  are some units that can retreat', () => {
    it('does not skip the retreat phase', () => {
      const u1 = new Unit(Army, $.Mar, Power.France)
      const u2 = new Unit(Fleet, $.Wes, Power.Italy)
      const board = new Board(
        map, new State(new Turn(1901, Season.Spring), Retreat),
        [
          new Unit(Army, $.Bur, Power.France),
          u1,
          u2
        ],
        [
          [u1, new Dislodged($.Gas.province)], [u2, new Dislodged($.Tyn.province)]
        ],
        [[$.Pie.province, new ProvinceStatus(null, true)]]
      );
      (generator.ordersToSkipPhase(board) === null).should.equal(true)
    })
  })
})
