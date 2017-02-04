'use strict'

const chai = require('chai')

const { Board, Unit } = require('../../../../lib/board/package')
const { map, location, Power } = require('../../../../lib/variant/standard/map/package')
const { Turn, Season } = require('../../../../lib/variant/standard/board/package')
const { Army, Fleet } = require('../../../../lib/variant/standard/rule/military-branch')
const { Movement } = require('../../../../lib/variant/standard/rule/phase')
const State = require('../../../../lib/variant/standard/rule/state')
const MovementOrderGenerator = require('../../../../lib/variant/standard/rule/movement-order-generator')
const Helper = require('../../../../lib/variant/standard/rule/standard-rule-helper')

chai.should()

const $ = location
const generator = new MovementOrderGenerator()

describe('A MovementOrderGenerator', () => {
  const board = new Board(
    map, new State(new Turn(1901, Season.Spring), Movement),
    [
      new Unit(Army, $.Spa, Power.France),
      new Unit(Fleet, $.GoL, Power.France)
    ],
    [], []
  )
  const $$ = new Helper(board)
  it('uses Hold as a default order', () => {
    generator.defaultOrderOf(board, $$.A($.Spa).unit).should.deep.equal($$.A($.Spa).hold())
    generator.defaultOrderOf(board, $$.F($.GoL).unit).should.deep.equal($$.F($.GoL).hold())
  })
  describe('when there are no units', () => {
    const board = new Board(
      map, new State(new Turn(1901, Season.Spring), Movement),
      [], [], []
    )
    it('uses an empty set to skip the movement phase', () => {
      generator.ordersToSkipPhase(board).should.deep.equal(new Set())
    })
  })
  describe('when there are some units', () => {
    it('does not skip the movement phase', () => {
      (generator.ordersToSkipPhase(board) === null).should.deep.equal(true)
    })
  })
})
