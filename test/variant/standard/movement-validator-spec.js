'use strict'

const chai = require('chai')
const assert = require('assert')

const Helper = require('./../../../lib/variant/helper')
const Board = require('./../../../lib/data/board')
const MovementValidator = require('./../../../lib/variant/standard/movement-validator')

const rule = require('./../../../lib/variant/standard/rule')
const map = require('./../../../lib/variant/standard/map')

const variant = require('./../../../lib/variant/standard/variant')

const $ = new Helper(rule, map)
const v = new MovementValidator(rule)

chai.should()

describe('MovementValidator', () => {
  it('uses Hold as a default order.', () => {
    v.defaultOrder(map, variant.initialBoard, $.A($.Lon)).type.should.equal('Hold')
    v.defaultOrder(map, variant.initialBoard, $.F($.Lon)).type.should.equal('Hold')
  })
  describe('valid order is received', () => {
    it('returns null (1)', () => {
      const msg = v.getErrorMessageForOrder(map, variant.initialBoard, $.A($.Lvp).move($.Bre));

      (msg === null).should.equal(true)
    })
    it('returns null (2)', () => {
      const msg = v.getErrorMessageForOrder(
        map, new Board(null, [[$.France, [$.A($.Spa)]]], [], [], []), $.A($.Spa).move($.Tun)
      );

      (msg === null).should.equal(true)
    })
  })
  describe('creates an order to an unit that does not exist.', () => {
    it('creates an error message.', () => {
      const msg = v.getErrorMessageForOrder(map, variant.initialBoard, $.A($.Lon).hold())
      msg.should.equal('A Lon does not exist.')
    })
  })
  describe('try to move an invalid location', () => {
    it('creates an error message.', () => {
      const msg = v.getErrorMessageForOrder(map, variant.initialBoard, $.F($.Lon).move($.Bud))
      msg.should.equal('F Lon cannot move to Bud.')
    })
  })
  describe('creates an invalid support order', () => {
    it('creates an error message (1).', () => {
      const msg = v.getErrorMessageForOrder(
        map,
        variant.initialBoard, $.F($.Lon).support($.F($.Edi).hold())
      )
      msg.should.equal('F Lon cannot support F Edi H.')
    })
    it('creates an error message (2).', () => {
      const msg = v.getErrorMessageForOrder(
        map, variant.initialBoard,
        $.F($.Lon).support($.F($.Edi).move($.Bud))
      )
      msg.should.equal('F Edi cannot move to Bud.')
    })
  })
  describe('creates a convoy order', () => {
    it('creates an error message (1).', () => {
      const msg = v.getErrorMessageForOrder(
        map, variant.initialBoard,
        $.A($.Lvp).convoy($.F($.Lon).hold())
      )
      msg.should.equal('A Lvp is not fleet.')
    })
    it('creates an error message (2).', () => {
      const msg = v.getErrorMessageForOrder(
        map, variant.initialBoard,
        $.F($.Lon).convoy($.F($.Edi).hold())
      )
      msg.should.equal('F Edi H cannot be a target of Convoy order.')
    })
    it('creates an error message (3).', () => {
      const msg = v.getErrorMessageForOrder(
        map, variant.initialBoard,
        $.F($.Lon).convoy($.F($.Lon).move($.Eng))
      )
      msg.should.equal('F Lon is not army.')
    })
    it('creates an error message (4).', () => {
      const msg = v.getErrorMessageForOrder(
        map, variant.initialBoard,
        $.F($.Lon).convoy($.A($.Lvp).move($.Bre))
      )
      msg.should.equal('F Lon is not on sea.')
    })
  })
})
