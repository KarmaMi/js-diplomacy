'use strict'

const chai = require('chai')
const assert = require('assert')

const Board = require('./../../../lib/data/board')
const Helper = require('./../../../lib/variant/helper')
const MovementResolver = require('./../../../lib/variant/standard/movement-resolver')

const rule = require('./../../../lib/variant/standard/rule')
const map = require('./../../../lib/variant/standard/map')

const variant = require('./../../../lib/variant/standard/variant')

const $ = new Helper(rule, map)
const r = new MovementResolver(rule)

chai.should()

describe('MovementResolver', () => {
  it('uses Hold as a default order.', () => {
    r.defaultOrder(map, variant.initialBoard, $.A($.Lon)).type.should.equal('Hold')
    r.defaultOrder(map, variant.initialBoard, $.F($.Lon)).type.should.equal('Hold')
  })
  describe('valid order is received', () => {
    it('returns null', () => {
      const msg = r.getErrorMessageForOrder(map, variant.initialBoard, $.A($.Lvp).move($.Bre));

      (msg === null).should.equal(true)
    })
  })
  describe('creates an order to an unit that does not exist.', () => {
    it('creates an error message.', () => {
      const msg = r.getErrorMessageForOrder(map, variant.initialBoard, $.A($.Lon).hold())
      msg.should.equal('A Lon does not exist.')
    })
  })
  describe('try to move an invalid location', () => {
    it('creates an error message.', () => {
      const msg = r.getErrorMessageForOrder(map, variant.initialBoard, $.F($.Lon).move($.Bud))
      msg.should.equal('F Lon cannot move to Bud.')
    })
  })
  describe('creates an invalid support order', () => {
    it('creates an error message (1).', () => {
      const msg = r.getErrorMessageForOrder(
        map,
        variant.initialBoard, $.F($.Lon).support($.F($.Edi).hold())
      )
      msg.should.equal('F Lon cannot support F Edi H.')
    })
    it('creates an error message (2).', () => {
      const msg = r.getErrorMessageForOrder(
        map, variant.initialBoard,
        $.F($.Lon).support($.F($.Edi).move($.Bud))
      )
      msg.should.equal('F Edi cannot move to Bud.')
    })
  })
  describe('creates a convoy order', () => {
    it('creates an error message (1).', () => {
      const msg = r.getErrorMessageForOrder(
        map, variant.initialBoard,
        $.A($.Lvp).convoy($.F($.Lon).hold())
      )
      msg.should.equal('A Lvp is not fleet.')
    })
    it('creates an error message (2).', () => {
      const msg = r.getErrorMessageForOrder(
        map, variant.initialBoard,
        $.F($.Lon).convoy($.F($.Edi).hold())
      )
      msg.should.equal('F Edi H cannot be a target of Convoy order.')
    })
    it('creates an error message (3).', () => {
      const msg = r.getErrorMessageForOrder(
        map, variant.initialBoard,
        $.F($.Lon).convoy($.F($.Lon).move($.Eng))
      )
      msg.should.equal('F Lon is not army.')
    })
    it('creates an error message (4).', () => {
      const msg = r.getErrorMessageForOrder(
        map, variant.initialBoard,
        $.F($.Lon).convoy($.A($.Lvp).move($.Bre))
      )
      msg.should.equal('F Lon is not on sea.')
    })
  })

  describe('#resolve', () => {
    it('resolves orders (DIAGRAM 4)', () => {
      let { board, orderResult } = r.resolve(
        map,
        new Board(
          variant.initialBoard.state,
          [[$.Germany, [$.A($.Ber)]], [$.Russia, [$.A($.War)]]],
          [], [], []
        ),
        [$.A($.Ber).move($.Sil), $.A($.War).move($.Sil)]
      )
      orderResult = [...orderResult].map(elem => [elem[0].toString(), elem[1]])

      orderResult.should.deep.equal([
        [$.A($.Ber).move($.Sil).toString(), $.Standoff],
        [$.A($.War).move($.Sil).toString(), $.Standoff]
      ])

      board.provincesStatus.has($.Sil.province).should.equal(true)
      board.provincesStatus.get($.Sil.province).should.equal($.Standoff)

      const units = [...board.units].map(x => [x[0], x[1].map(e => e.toString())])
      units.should.deep.equal(
        [[$.Germany, [$.A($.Ber).toString()]], [$.Russia, [$.A($.War).toString()]]]
      )
    })
  })
})
