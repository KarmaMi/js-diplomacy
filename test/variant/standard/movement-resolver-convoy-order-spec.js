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

describe('MovementResolver#Convoy Order', () => {
  it('DIAGRAM 19', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.England, [$.A($.Lon), $.F($.Nth)]]],
        [], [], []
      ),
      [$.F($.Nth).convoy($.A($.Lon).move($.Nwy)), $.A($.Lon).move($.Nwy)]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Nth).convoy($.A($.Lon).move($.Nwy)), $.Success],
        [$.A($.Lon).move($.Nwy), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.England, [$.A($.Nwy), $.F($.Nth)]]],
        [], [], []
      )
    )
  })
  it('DIAGRAM 20', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.England, [$.A($.Lon), $.F($.Eng), $.F($.Mid)]], [$.France, [$.F($.Wes)]]],
        [], [], []
      ),
      [
        $.F($.Eng).convoy($.A($.Lon).move($.Tun)),
        $.F($.Mid).convoy($.A($.Lon).move($.Tun)),
        $.F($.Wes).convoy($.A($.Lon).move($.Tun)),
        $.A($.Lon).move($.Tun)
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Eng).convoy($.A($.Lon).move($.Tun)), $.Success],
        [$.F($.Mid).convoy($.A($.Lon).move($.Tun)), $.Success],
        [$.F($.Wes).convoy($.A($.Lon).move($.Tun)), $.Success],
        [$.A($.Lon).move($.Tun), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.England, [$.A($.Tun), $.F($.Eng), $.F($.Mid)]], [$.France, [$.F($.Wes)]]],
        [], [], []
      )
    )
  })
  it('DIAGRAM 21', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.France, [$.A($.Spa), $.F($.GoL), $.F($.Tyn)]],
          [$.Italy, [$.F($.Tun), $.F($.Ion)]]
        ],
        [], [], []
      ),
      [
        $.A($.Spa).move($.Nap),
        $.F($.GoL).convoy($.A($.Spa).move($.Nap)), $.F($.Tyn).convoy($.A($.Spa).move($.Nap)),
        $.F($.Ion).move($.Tyn), $.F($.Tun).support($.F($.Ion).move($.Tyn))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.GoL).convoy($.A($.Spa).move($.Nap)), $.Failed],
        [$.F($.Tyn).convoy($.A($.Spa).move($.Nap)), $.Dislodged],
        [$.F($.Ion).move($.Tyn), $.Success],
        [$.F($.Tun).support($.F($.Ion).move($.Tyn)), $.Success],
        [$.A($.Spa).move($.Nap), $.Failed]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.France, [$.A($.Spa), $.F($.GoL)]],
          [$.Italy, [$.F($.Tun), $.F($.Tyn)]]
        ],
        [], [[$.F($.Tyn), $.Dislodged]], []
      )
    )
  })
})
