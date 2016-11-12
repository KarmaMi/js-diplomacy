'use strict'

const chai = require('chai')

const Board = require('./../../../lib/data/board')
const State = require('./../../../lib/data/state')
const Helper = require('./../../../lib/variant/helper')
const RetreatResolver = require('./../../../lib/variant/standard/retreat-resolver')

const StandardSpecUtil = require('./standard-spec-util')

const ruleKeywords = require('./../../../lib/variant/standard/rule-keywords')
const map = require('./../../../lib/variant/standard/map')

const $ = new Helper(ruleKeywords, map)
const r = new RetreatResolver()

const b = new Board(
  new State(1901, $.Spring, $.Retreat),
  [[$.France, [$.A($.Bur)]]],
  [],
  [
    [$.France, [[$.A($.Mar), { status: $.Dislodged, attackedFrom: $.Gas.province }]]],
    [$.Italy, [[$.F($.Wes), { status: $.Dislodged, attackedFrom: $.Tyn.province }]]]
  ],
  [[$.Pie.province, $.Standoff]]
)

chai.should()

describe('RetreatResolver', () => {
  it('resolves disband order', () => {
    const { board, orderResult } = r.resolve(
      map, b, [$.A($.Mar).disband(), $.F($.Wes).disband()]
    )

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Mar).disband(), $.Success],
        [$.F($.Wes).disband(), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.A($.Bur)]], [$.Italy, []]],
        [], [], []
      )
    )
  })
  it('resolves retreat order (1)', () => {
    const { board, orderResult } = r.resolve(
      map, b, [$.A($.Mar).retreat($.Spa), $.F($.Wes).retreat($.NAf)]
    )

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Mar).retreat($.Spa), $.Success],
        [$.F($.Wes).retreat($.NAf), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.A($.Bur), $.A($.Spa)]], [$.Italy, [$.F($.NAf)]]],
        [], [], []
      )
    )
  })
  it('resolves retreat order (2)', () => {
    const { board, orderResult } = r.resolve(
      map, b, [$.A($.Mar).retreat($.Spa), $.F($.Wes).retreat($.Spa)]
    )

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Mar).retreat($.Spa), $.Failed],
        [$.F($.Wes).retreat($.Spa), $.Failed]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.A($.Bur)]], [$.Italy, []]],
        [], [], []
      )
    )
  })
})
