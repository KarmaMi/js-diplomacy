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

describe('MovementResolver', () => {
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
      [[$.A($.Ber).move($.Sil), $.Standoff], [$.A($.War).move($.Sil), $.Standoff]]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
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
        [$.A($.Ber).move($.Pru), $.Fail],
        [$.A($.Pru).hold(), $.Success],
        [$.A($.Kie).move($.Ber), $.Fail]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
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
        [$.A($.Pru).move($.Ber), $.Fail],
        [$.A($.Ber).move($.Pru), $.Fail]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
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
        new State(1901, $.Autumn, $.Movement),
        [[$.England, [$.F($.Nth), $.F($.Hol)]], [$.Germany, [$.A($.Bel)]]],
        [], [], []
      )
    )
  })
  it('DIAGRAM 8', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.A($.Gas), $.F($.Mar)]], [$.Germany, [$.A($.Bur)]]],
        [], [], []
      ),
      [$.A($.Mar).move($.Bur), $.A($.Gas).support($.A($.Mar).move($.Bur)), $.A($.Bur).hold()]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Gas).support($.A($.Mar).move($.Bur)), $.Success],
        [$.A($.Mar).move($.Bur), $.Success],
        [$.A($.Bur).hold(), $.Dislodged]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.France, [$.A($.Gas), $.F($.Bur)]], [$.Germany, []]],
        [], [[$.A($.Bur), $.Dislodged]], []
      )
    )
  })
  it('DIAGRAM 9', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.F($.Bal), $.A($.Sil)]], [$.Russia, [$.A($.Pru)]]],
        [], [], []
      ),
      [$.F($.Bal).support($.A($.Sil).move($.Pru)), $.A($.Sil).move($.Pru), $.A($.Pru).hold()]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Bal).support($.A($.Sil).move($.Pru)), $.Success],
        [$.A($.Sil).move($.Pru), $.Success],
        [$.A($.Pru).hold(), $.Dislodged]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.Germany, [$.F($.Bal), $.A($.Pru)]], [$.Russia, []]],
        [], [[$.A($.Pru), $.Dislodged]], []
      )
    )
  })
  it('DIAGRAM 10', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.F($.GoL), $.F($.Wes)]], [$.Italy, [$.F($.Rom), $.F($.Nap)]]],
        [], [], []
      ),
      [
        $.F($.GoL).move($.Tyn), $.F($.Wes).support($.F($.GoL).move($.Tyn)),
        $.F($.Nap).move($.Tyn), $.F($.Rom).support($.F($.Nap).move($.Tyn))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Wes).support($.F($.GoL).move($.Tyn)), $.Success],
        [$.F($.Rom).support($.F($.Nap).move($.Tyn)), $.Success],
        [$.F($.GoL).move($.Tyn), $.Standoff],
        [$.F($.Nap).move($.Tyn), $.Standoff]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.F($.GoL), $.F($.Wes)]], [$.Italy, [$.F($.Rom), $.F($.Nap)]]],
        [], [], [[$.Tyn.province, $.Standoff]]
      )
    )
  })
  it('DIAGRAM 11', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.F($.GoL), $.F($.Wes)]], [$.Italy, [$.F($.Rom), $.F($.Tyn)]]],
        [], [], []
      ),
      [
        $.F($.GoL).move($.Tyn), $.F($.Wes).support($.F($.GoL).move($.Tyn)),
        $.F($.Tyn).hold(), $.F($.Rom).support($.F($.Tyn).hold())
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Wes).support($.F($.GoL).move($.Tyn)), $.Success],
        [$.F($.Rom).support($.F($.Tyn).hold()), $.Success],
        [$.F($.GoL).move($.Tyn), $.Fail],
        [$.F($.Tyn).hold(), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.F($.GoL), $.F($.Wes)]], [$.Italy, [$.F($.Rom), $.F($.Tyn)]]],
        [], [], []
      )
    )
  })
  it('DIAGRAM 12', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.Austria, [$.A($.Boh), $.A($.Tyr)]],
          [$.Germany, [$.A($.Ber), $.A($.Mun)]],
          [$.Russia, [$.A($.Pru), $.A($.War)]]
        ],
        [], [], []
      ),
      [
        $.A($.Boh).move($.Mun), $.A($.Tyr).support($.A($.Boh).move($.Mun)),
        $.A($.Mun).move($.Sil), $.A($.Ber).support($.A($.Mun).move($.Sil)),
        $.A($.War).move($.Sil), $.A($.Pru).support($.A($.War).move($.Sil))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Tyr).support($.A($.Boh).move($.Mun)), $.Success],
        [$.A($.Ber).support($.A($.Mun).move($.Sil)), $.Success],
        [$.A($.Pru).support($.A($.War).move($.Sil)), $.Success],
        [$.A($.Mun).move($.Sil), $.Dislodged],
        [$.A($.War).move($.Sil), $.Standoff],
        [$.A($.Boh).move($.Mun), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.Austria, [$.A($.Mun), $.A($.Tyr)]],
          [$.Germany, [$.A($.Ber)]],
          [$.Russia, [$.A($.Pru), $.A($.War)]]
        ],
        [], [[$.A($.Mun), $.Dislodged]], [[$.Sil.province, $.Standoff]]
      )
    )
  })
  it('DIAGRAM 13', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.Austria, [$.A($.Ser), $.A($.Rum), $.A($.Sev)]],
          [$.Turkey, [$.A($.Bul)]]
        ],
        [], [], []
      ),
      [
        $.A($.Bul).move($.Rum),
        $.A($.Rum).move($.Bul), $.A($.Sev).move($.Rum), $.A($.Ser).support($.A($.Rum).move($.Bul))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Ser).support($.A($.Rum).move($.Bul)), $.Success],
        [$.A($.Bul).move($.Rum), $.Dislodged],
        [$.A($.Rum).move($.Bul), $.Success],
        [$.A($.Sev).move($.Rum), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.Austria, [$.A($.Ser), $.A($.Bul), $.A($.Rum)]],
          [$.Turkey, []]
        ],
        [], [[$.A($.Bul), $.Dislodged]], []
      )
    )
  })
  it('DIAGRAM 14', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.Austria, [$.A($.Ser), $.A($.Rum), $.A($.Sev), $.A($.Gre)]],
          [$.Turkey, [$.A($.Bul), $.F($.Bla)]]
        ],
        [], [], []
      ),
      [
        $.A($.Bul).move($.Rum), $.F($.Bla).support($.A($.Bul).move($.Rum)),
        $.A($.Rum).move($.Bul), $.A($.Sev).move($.Rum),
        $.A($.Ser).support($.A($.Rum).move($.Bul)), $.A($.Gre).support($.A($.Rum).move($.Bul))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Bla).support($.A($.Bul).move($.Rum)), $.Success],
        [$.A($.Ser).support($.A($.Rum).move($.Bul)), $.Success],
        [$.A($.Gre).support($.A($.Rum).move($.Bul)), $.Success],
        [$.A($.Bul).move($.Rum), $.Dislodged],
        [$.A($.Rum).move($.Bul), $.Success],
        [$.A($.Sev).move($.Rum), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.Austria, [$.A($.Ser), $.A($.Bul), $.A($.Rum), $.A($.Gre)]],
          [$.Turkey, [$.F($.Bla)]]
        ],
        [], [[$.A($.Bul), $.Dislodged]], []
      )
    )
  })
  it('DIAGRAM 15', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.A($.Pru), $.A($.Sil)]], [$.Russia, [$.A($.Boh), $.A($.War)]]],
        [], [], []
      ),
      [
        $.A($.Pru).move($.War), $.A($.Sil).support($.A($.Pru).move($.War)),
        $.A($.War).hold(), $.A($.Boh).move($.Sil)
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Sil).support($.A($.Pru).move($.War)), $.Cut],
        [$.A($.Boh).move($.Sil), $.Fail],
        [$.A($.Pru).move($.War), $.Fail],
        [$.A($.War).hold(), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.Germany, [$.A($.Pru), $.A($.Sil)]], [$.Russia, [$.A($.Boh), $.A($.War)]]],
        [], [], []
      )
    )
  })
})
