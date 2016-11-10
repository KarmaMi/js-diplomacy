'use strict'

const chai = require('chai')
const assert = require('assert')

const Helper = require('./../../../lib/variant/helper')
const Board = require('./../../../lib/data/board')
const RetreatValidator = require('./../../../lib/variant/standard/retreat-validator')

const rule = require('./../../../lib/variant/standard/rule')
const map = require('./../../../lib/variant/standard/map')

const variant = require('./../../../lib/variant/standard/variant')

const $ = new Helper(rule, map)
const v = new RetreatValidator(rule)

const board = new Board(
  null,
  [[$.France, [$.A($.Bur)]]],
  [],
  [[$.France, [[$.A($.Mar), { status: $.Dislodged, attackedFrom: $.Gas.province }]]]],
  [[$.Pie.province, $.Standoff]]
)

chai.should()

describe('RetreatValidator', () => {
  it('uses Disband as a default order.', () => {
    v.defaultOrder(map, board, $.A($.Mar)).type.should.equal('Disband')
  })
  describe('valid order is received', () => {
    it('returns null (1)', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Mar).retreat($.Spa));

      (msg === null).should.equal(true)
    })
    it('returns null (2)', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Mar).disband());

      (msg === null).should.equal(true)
    })
  })
  describe('creates an order to an unit that is not dislodged.', () => {
    it('creates an error message.', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Lon).disband())
      msg.should.equal('A Lon is not dislodged.')
    })
  })
  describe('try to retreat an invalid location', () => {
    it('creates an error message.', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Mar).retreat($.Hol))
      msg.should.equal('A Mar cannot move to Hol.')
    })
  })
  describe('try to retreat a location that has an unit', () => {
    it('creates an error message.', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Mar).retreat($.Bur))
      msg.should.equal('An unit is in Bur.')
    })
  })
  describe('try to retreat a location of the attacking unit', () => {
    it('creates an error message.', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Mar).retreat($.Gas))
      msg.should.equal('A Mar was dislodged by the attack from Gas.')
    })
  })
  describe('try to retreat a stand-off location', () => {
    it('creates an error message.', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Mar).retreat($.Pie))
      msg.should.equal('Pie was stand-off.')
    })
  })
})
