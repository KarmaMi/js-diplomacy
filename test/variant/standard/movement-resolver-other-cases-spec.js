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

describe('MovementResolver#Other Cases', () => {
  it('No corresponding order (support)', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.A($.Par), $.A($.Mar)]]],
        [], [], []
      ),
      [$.A($.Par).move($.Bur), $.A($.Mar).support($.A($.Par).move($.Gas))]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Mar).support($.A($.Par).move($.Gas)), $.NoCorrespondingOrder],
        [$.A($.Par).move($.Bur), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.A($.Bur), $.A($.Mar)]]],
        [], [], []
      )
    )
  })
  it('No corresponding order (convoy)', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.A($.Bre), $.F($.Eng)]]],
        [], [], []
      ),
      [$.A($.Bre).move($.Par), $.F($.Eng).convoy($.A($.Bre).move($.Lon))]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Eng).convoy($.A($.Bre).move($.Lon)), $.NoCorrespondingOrder],
        [$.A($.Bre).move($.Par), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.A($.Par), $.F($.Eng)]]],
        [], [], []
      )
    )
  })
  it('swap locations using convoy (1)', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.A($.Pru), $.A($.Ber), $.F($.Bal)]]],
        [], [], []
      ),
      [$.A($.Pru).move($.Ber), $.A($.Ber).move($.Pru), $.F($.Bal).convoy($.A($.Pru).move($.Ber))]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Bal).convoy($.A($.Pru).move($.Ber)), $.Success],
        [$.A($.Ber).move($.Pru), $.Success],
        [$.A($.Pru).move($.Ber), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.Germany, [$.A($.Ber), $.A($.Pru), $.F($.Bal)]]],
        [], [], []
      )
    )
  })
  it('swap locations using convoy (2)', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.Germany, [$.A($.Ber), $.F($.Bal)]],
          [$.Russia, [$.A($.Pru), $.A($.Sil)]]
        ],
        [], [], []
      ),
      [
        $.A($.Pru).move($.Ber), $.A($.Sil).support($.A($.Pru).move($.Ber)),
        $.A($.Ber).move($.Pru), $.F($.Bal).convoy($.A($.Pru).move($.Ber))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Bal).convoy($.A($.Pru).move($.Ber)), $.Success],
        [$.A($.Ber).move($.Pru), $.Success],
        [$.A($.Pru).move($.Ber), $.Success],
        [$.A($.Sil).support($.A($.Pru).move($.Ber)), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [
          [$.Germany, [$.A($.Pru), $.F($.Bal)]],
          [$.Russia, [$.A($.Ber), $.A($.Sil)]]
        ],
        [], [], []
      )
    )
  })
  it('two units support each other.', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.England, [$.F($.Nth), $.F($.Nwy)]]],
        [], [], []
      ),
      [
        $.F($.Nth).support($.F($.Nwy).hold()), $.F($.Nwy).support($.F($.Nth).hold())
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Nwy).support($.F($.Nth).hold()), $.Success],
        [$.F($.Nth).support($.F($.Nwy).hold()), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.England, [$.F($.Nth), $.F($.Nwy)]]],
        [], [], []
      )
    )
  })
})
