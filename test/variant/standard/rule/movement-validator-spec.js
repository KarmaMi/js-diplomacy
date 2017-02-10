'use strict'

const chai = require('chai')

const { Board, Unit } = require('../../../../lib/board/package')
const { map, location, Power } = require('../../../../lib/variant/standard/map/package')
const { Turn, Season } = require('../../../../lib/variant/standard/board/package')
const { Army, Fleet } = require('../../../../lib/variant/standard/rule/military-branch')
const { Movement } = require('../../../../lib/variant/standard/rule/phase')
const Order = require('../../../../lib/variant/standard/rule/order')
const State = require('../../../../lib/variant/standard/rule/state')
const MovementValidator = require('../../../../lib/variant/standard/rule/movement-validator')
const Helper = require('../../../../lib/variant/standard/rule/standard-rule-helper')

chai.should()

const $ = location
const validator = new MovementValidator()

describe('A MovementValidator', () => {
  const board = new Board(
    map, new State(new Turn(1901, Season.Autumn), Movement),
    [
      new Unit(Army, $.Lvp, Power.England),
      new Unit(Fleet, $.Lon, Power.England),
      new Unit(Fleet, $.Mid, Power.England),
      new Unit(Fleet, $.Eng, Power.England),
      new Unit(Army, $.Spa, Power.France),
      new Unit(Army, $.Bur, Power.France)
    ],
    [], []
  )
  const $$ = new Helper(board)
  describe('a valid order is received', () => {
    it('returns null (1)', () => {
      (validator.errorMessageOfOrder(board, $$.A($.Lvp).move($.Yor)) === null).should.equal(true)
    })
    it('returns null (2)', () => {
      (validator.errorMessageOfOrder(board, $$.A($.Spa).move($.Wal)) === null).should.equal(true)
    })
  })
  describe('an order that its target unit does not exist is received', () => {
    it('returns an error message', () => {
      validator.errorMessageOfOrder(board, new Order.Move(new Unit(Army, $.Lon, Power.England)))
        .should.deep.equal('A Lon does not exist')
    })
  })
  describe('a unit tries to move an invalid location', () => {
    it('returns an error message', () => {
      validator.errorMessageOfOrder(board, $$.A($.Lvp).move($.Bud))
        .should.deep.equal('A Lvp cannot move to Bud')
    })
  })
  describe('a unit tries to support an invalid location', () => {
    it('returns an error message (1)', () => {
      validator.errorMessageOfOrder(board, $$.A($.Lvp).support($$.A($.Spa).hold()))
        .should.deep.equal('A Lvp cannot support A Spa H')
    })
    it('returns an error message (2)', () => {
      validator.errorMessageOfOrder(board, $$.A($.Lvp).support($$.A($.Spa).move($.Bud)))
        .should.deep.equal('A Spa cannot move to Bud')
    })
  })
  describe('a unit tries to convoy an invalid order', () => {
    it('returns an error message (1)', () => {
      validator.errorMessageOfOrder(board, $$.A($.Lvp).convoy($$.F($.Lon).move($.Yor)))
        .should.deep.equal('A Lvp is not fleet')
    })
    it('returns an error message (2)', () => {
      validator.errorMessageOfOrder(board, $$.F($.Eng).convoy($$.F($.Lon).move($.Eng)))
        .should.deep.equal('F Lon is not army')
    })
    it('returns an error message (3)', () => {
      validator.errorMessageOfOrder(board, $$.F($.Eng).convoy($$.A($.Bur).move($.Mar)))
        .should.deep.equal('Moving from Bur to Mar via convoy is invalid')
    })
  })
})
