'use strict'

const chai = require('chai')

const Helper = require('./../../../lib/variant/helper')
const Board = require('./../../../lib/data/board')
const BuildValidator = require('./../../../lib/variant/standard/build-validator')

const ruleKeywords = require('./../../../lib/variant/standard/rule-keywords')
const map = require('./../../../lib/variant/standard/map')

const $ = new Helper(ruleKeywords, map)
const v = new BuildValidator()

const board = new Board(
  null,
  [[$.Germany, [$.A($.Mun)]], [$.Italy, [$.F($.Nap)]]],
  [[$.Italy, [$.Rom.province, $.Nap.province]], [$.France, [$.Par.province]]],
  [], []
)

chai.should()

describe('BuildValidator', () => {
  describe('valid order is received', () => {
    it('returns null (1)', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Rom).build());

      (msg === null).should.equal(true)
    })
    it('returns null (2)', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Mun).disband());

      (msg === null).should.equal(true)
    })
  })
  describe('valid set of orders is received', () => {
    it('returns null', () => {
      const msg = v.getErrorMessageForOrders(map, board, [$.A($.Mun).disband()]);

      (msg === null).should.equal(true)
    })
  })
  describe('try to build an unit to a location that has another unit', () => {
    it('returns an error message', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Nap).build())
      msg.should.equal('An unit is in Nap.')
    })
  })
  describe('try to build an unit to a province that is not home country', () => {
    it('returns an error message', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Spa).build())
      msg.should.equal('Spa is not home country of any forces.')
    })
  })
  describe('try to build an unit to a province that is not supply center', () => {
    it('returns an error message', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Ruh).build())
      msg.should.equal('Ruh is not supply center.')
    })
  })
  describe('try to build an unit to a province that is not occupied', () => {
    it('returns an error message', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Ber).build())
      msg.should.equal('Ber is not occupied by Germany.')
    })
  })
  describe('try to disband an unit that does not exist', () => {
    it('returns an error message', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.A($.Ber).disband())
      msg.should.equal('A Ber does not exists.')
    })
  })
  describe('try an unnecessary disband order', () => {
    it('returns an error message', () => {
      const msg = v.getErrorMessageForOrder(map, board, $.F($.Nap).disband())
      msg.should.equal('Italy has sufficient supply centers.')
    })
  })
  describe('try to keep units that are more than supply centers', () => {
    it('returns an error message', () => {
      const msg = v.getErrorMessageForOrders(map, board, [])
      msg.should.equal('Germany does not have sufficient supply centers.')
    })
  })
})
