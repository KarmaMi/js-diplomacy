'use strict'

const chai = require('chai')
const assert = require('assert')

const Board = require('./../../../lib/data/board')
const State = require('./../../../lib/data/state')
const Helper = require('./../../../lib/variant/helper')
const MovementResolver = require('./../../../lib/variant/standard/movement-resolver')

const ResolverSpecUtil = require('./resolver-spec-util')

const rule = require('./../../../lib/variant/standard/rule')
const map = require('./../../../lib/variant/standard/map')
const variant = require('./../../../lib/variant/standard/variant')

const $ = new Helper(rule, map)
const r = new MovementResolver(rule)

chai.should()

describe('MovementResolver#Standoffs', () => {
  it('DIAGRAM 4', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.A($.Ber)]], [$.Russia, [$.A($.War)]]],
        [], [], []
      ),
      [$.A($.Ber).move($.Sil), $.A($.War).move($.Sil)]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [[$.A($.Ber).move($.Sil), $.Bounced], [$.A($.War).move($.Sil), $.Bounced]]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.Germany, [$.A($.Ber)]], [$.Russia, [$.A($.War)]]],
        [], [], [[$.Sil.province, $.Standoff]]
      )
    )
  })
  it('DIAGRAM 5', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.A($.Kie), $.A($.Ber)]], [$.Russia, [$.A($.Pru)]]],
        [], [], []
      ),
      [$.A($.Kie).move($.Ber), $.A($.Ber).move($.Pru), $.A($.Pru).hold()]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Pru).hold(), $.Success],
        [$.A($.Ber).move($.Pru), $.Bounced],
        [$.A($.Kie).move($.Ber), $.Bounced]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.Germany, [$.A($.Kie), $.A($.Ber)]], [$.Russia, [$.A($.Pru)]]],
        [], [], []
      )
    )
  })
  it('DIAGRAM 6', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.A($.Ber)]], [$.Russia, [$.A($.Pru)]]],
        [], [], []
      ),
      [$.A($.Ber).move($.Pru), $.A($.Pru).move($.Ber)]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Pru).move($.Ber), $.Bounced],
        [$.A($.Ber).move($.Pru), $.Bounced]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.Germany, [$.A($.Ber)]], [$.Russia, [$.A($.Pru)]]],
        [], [], []
      )
    )
  })
  it('DIAGRAM 7', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.England, [$.F($.Bel), $.F($.Nth)]], [$.Germany, [$.A($.Hol)]]],
        [], [], []
      ),
      [$.F($.Bel).move($.Nth), $.F($.Nth).move($.Hol), $.A($.Hol).move($.Bel)]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Hol).move($.Bel), $.Success],
        [$.F($.Nth).move($.Hol), $.Success],
        [$.F($.Bel).move($.Nth), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.England, [$.F($.Nth), $.F($.Hol)]], [$.Germany, [$.A($.Bel)]]],
        [], [], []
      )
    )
  })
})
