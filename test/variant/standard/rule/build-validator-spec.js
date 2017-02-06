'use strict'

const chai = require('chai')

const { Board, Unit } = require('../../../../lib/board/package')
const { map, location, Power } = require('../../../../lib/variant/standard/map/package')
const { Turn, Season } = require('../../../../lib/variant/standard/board/package')
const { Army, Fleet } = require('../../../../lib/variant/standard/rule/military-branch')
const { Build } = require('../../../../lib/variant/standard/rule/phase')
const Order = require('../../../../lib/variant/standard/rule/order')
const ProvinceStatus = require('../../../../lib/variant/standard/rule/province-status')
const State = require('../../../../lib/variant/standard/rule/state')
const BuildValidator = require('../../../../lib/variant/standard/rule/build-validator')
const Helper = require('../../../../lib/variant/standard/rule/standard-rule-helper')

chai.should()

const $ = location
const validator = new BuildValidator()

describe('A BuildValidator', () => {
  const board = new Board(
    map, new State(new Turn(1901, Season.Autumn), Build),
    [
      new Unit(Army, $.Mun, Power.Germany),
      new Unit(Fleet, $.Nap, Power.Italy)
    ],
    [],
    [
      [$.Rom.province, new ProvinceStatus(Power.Italy, false)],
      [$.Nap.province, new ProvinceStatus(Power.Italy, false)],
      [$.Mar.province, new ProvinceStatus(Power.France, false)]
    ]
  )
  const $$ = new Helper(board)
  describe('when a valid order is received', () => {
    it('returns null (1)', () => {
      (validator.errorMessageOfOrder(board, $$.A($.Rom).build()) === null).should.equal(true)
    })
    it('returns null (2)', () => {
      (validator.errorMessageOfOrder(board, $$.A($.Mun).disband()) === null).should.equal(true)
    })
  })
  describe('when try to build an unit to a location that has another unit', () => {
    it('returns an error message', () => {
      validator.errorMessageOfOrder(board, $$.A($.Nap).build()).should.equal(
        'An unit is in Nap'
      )
    })
  })
  describe('when try to build an unit to a province that is not home province', () => {
    it('returns an error message', () => {
      validator.errorMessageOfOrder(
        board, new Order.Build(new Unit(Army, $.Spa, Power.France))
      ).should.equal('France cannot build an unit in Spa')
    })
  })
  describe('when try to build an unit to a province that is not supply center', () => {
    it('returns an error message', () => {
      validator.errorMessageOfOrder(board, $$.A($.Ruh).build()).should.equal(
        'Ruh is not supply center'
      )
    })
  })
  describe('when try to build an unit to a province that is not occupied', () => {
    it('returns an error message', () => {
      validator.errorMessageOfOrder(board, $$.A($.Bre).build()).should.equal(
        'Bre is not occupied by France'
      )
    })
  })
  describe('when try to disband an unit that does not exist', () => {
    it('returns an error message', () => {
      validator.errorMessageOfOrder(
        board, new Order.Disband(new Unit(Army, $.Ber, Power.Germany))
      ).should.equal(
        'A Ber does not exist'
      )
    })
  })
  describe('when try to an unnecessary disband order', () => {
    it('returns an error message', () => {
      validator.errorMessageOfOrder(board, $$.F($.Nap).disband()).should.equal(
        'Italy has sufficient supply centers'
      )
    })
  })
  describe('when valid order set is received', () => {
    it('returns null', () => {
      (validator.errorMessageOfOrders(board, [$$.A($.Mun).disband()]) === null).should.equal(true)
    })
  })
  describe('when try to keep units that are more than supply centers', () => {
    it('returns an error message', () => {
      validator.errorMessageOfOrders(board, []).should.equal(
        `Germany does not have enough supply centers`
      )
    })
  })
})
