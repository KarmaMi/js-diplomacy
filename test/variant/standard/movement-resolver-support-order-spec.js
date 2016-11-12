'use strict'

const chai = require('chai')
const assert = require('assert')

const Board = require('./../../../lib/data/board')
const State = require('./../../../lib/data/state')
const Helper = require('./../../../lib/variant/helper')
const MovementResolver = require('./../../../lib/variant/standard/movement-resolver')

const StandardSpecUtil = require('./standard-spec-util')

const ruleKeywords = require('./../../../lib/variant/standard/rule-keywords')
const variant = require('./../../../lib/variant/standard/variant')
const { map } = variant

const $ = new Helper(ruleKeywords, map)
const r = new MovementResolver()

chai.should()

describe('MovementResolver#Support Order', () => {
  it('DIAGRAM 8', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.A($.Gas), $.A($.Mar)]], [$.Germany, [$.A($.Bur)]]],
        [], [], []
      ),
      [$.A($.Mar).move($.Bur), $.A($.Gas).support($.A($.Mar).move($.Bur)), $.A($.Bur).hold()]
    )

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Bur).hold(), $.Dislodged],
        [$.A($.Mar).move($.Bur), $.Success],
        [$.A($.Gas).support($.A($.Mar).move($.Bur)), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.France, [$.A($.Gas), $.A($.Bur)]], [$.Germany, []]],
        [],
        [[$.Germany, [[$.A($.Bur), { status: $.Dislodged, attackedFrom: $.Mar.province }]]]],
        []
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Pru).hold(), $.Dislodged],
        [$.A($.Sil).move($.Pru), $.Success],
        [$.F($.Bal).support($.A($.Sil).move($.Pru)), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.Germany, [$.F($.Bal), $.A($.Pru)]], [$.Russia, []]],
        [],
        [[$.Russia, [[$.A($.Pru), { status: $.Dislodged, attackedFrom: $.Sil.province }]]]],
        []
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.GoL).move($.Tyn), $.Bounced],
        [$.F($.Wes).support($.F($.GoL).move($.Tyn)), $.Failed],
        [$.F($.Nap).move($.Tyn), $.Bounced],
        [$.F($.Rom).support($.F($.Nap).move($.Tyn)), $.Failed]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Tyn).hold(), $.Success],
        [$.F($.Rom).support($.F($.Tyn).hold()), $.Success],
        [$.F($.GoL).move($.Tyn), $.Bounced],
        [$.F($.Wes).support($.F($.GoL).move($.Tyn)), $.Failed]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Mun).move($.Sil), $.Dislodged],
        [$.A($.Ber).support($.A($.Mun).move($.Sil)), $.Failed],
        [$.A($.War).move($.Sil), $.Bounced],
        [$.A($.Pru).support($.A($.War).move($.Sil)), $.Failed],
        [$.A($.Boh).move($.Mun), $.Success],
        [$.A($.Tyr).support($.A($.Boh).move($.Mun)), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.Austria, [$.A($.Mun), $.A($.Tyr)]],
          [$.Germany, [$.A($.Ber)]],
          [$.Russia, [$.A($.Pru), $.A($.War)]]
        ],
        [],
        [[$.Germany, [[$.A($.Mun), { status: $.Dislodged, attackedFrom: $.Boh.province }]]]],
        [[$.Sil.province, $.Standoff]]
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Bul).move($.Rum), $.Dislodged],
        [$.A($.Rum).move($.Bul), $.Success],
        [$.A($.Ser).support($.A($.Rum).move($.Bul)), $.Success],
        [$.A($.Sev).move($.Rum), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.Austria, [$.A($.Ser), $.A($.Bul), $.A($.Rum)]],
          [$.Turkey, []]
        ],
        [],
        [[$.Turkey, [[$.A($.Bul), { status: $.Dislodged, attackedFrom: $.Rum.province }]]]],
        []
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Bul).move($.Rum), $.Dislodged],
        [$.A($.Rum).move($.Bul), $.Success],
        [$.A($.Ser).support($.A($.Rum).move($.Bul)), $.Success],
        [$.A($.Gre).support($.A($.Rum).move($.Bul)), $.Success],
        [$.F($.Bla).support($.A($.Bul).move($.Rum)), $.Failed],
        [$.A($.Sev).move($.Rum), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.Austria, [$.A($.Ser), $.A($.Bul), $.A($.Rum), $.A($.Gre)]],
          [$.Turkey, [$.F($.Bla)]]
        ],
        [],
        [[$.Turkey, [[$.A($.Bul), { status: $.Dislodged, attackedFrom: $.Rum.province }]]]],
        []
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Sil).support($.A($.Pru).move($.War)), $.Cut],
        [$.A($.Boh).move($.Sil), $.Bounced],
        [$.A($.War).hold(), $.Success],
        [$.A($.Pru).move($.War), $.Bounced]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.Germany, [$.A($.Pru), $.A($.Sil)]], [$.Russia, [$.A($.Boh), $.A($.War)]]],
        [], [], []
      )
    )
  })
  it('DIAGRAM 16', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.A($.Pru), $.A($.Sil)]], [$.Russia, [$.A($.War)]]],
        [], [], []
      ),
      [
        $.A($.Pru).move($.War), $.A($.Sil).support($.A($.Pru).move($.War)),
        $.A($.War).move($.Sil)
      ]
    )

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.War).move($.Sil), $.Dislodged],
        [$.A($.Pru).move($.War), $.Success],
        [$.A($.Sil).support($.A($.Pru).move($.War)), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.Germany, [$.A($.War), $.A($.Sil)]], [$.Russia, []]],
        [],
        [[$.Russia, [[$.A($.War), { status: $.Dislodged, attackedFrom: $.Pru.province }]]]],
        []
      )
    )
  })
  it('DIAGRAM 17', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.A($.Ber), $.A($.Sil)]], [$.Russia, [$.F($.Bal), $.A($.Pru), $.A($.War)]]],
        [], [], []
      ),
      [
        $.A($.Ber).move($.Pru), $.A($.Sil).support($.A($.Ber).move($.Pru)),
        $.F($.Bal).move($.Pru), $.A($.Pru).move($.Sil), $.A($.War).support($.A($.Pru).move($.Sil))
      ]
    )

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Sil).support($.A($.Ber).move($.Pru)), $.Dislodged],
        [$.A($.Pru).move($.Sil), $.Success],
        [$.A($.War).support($.A($.Pru).move($.Sil)), $.Success],
        [$.A($.Ber).move($.Pru), $.Bounced],
        [$.F($.Bal).move($.Pru), $.Bounced]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.Germany, [$.A($.Ber)]], [$.Russia, [$.F($.Bal), $.A($.Sil), $.A($.War)]]],
        [],
        [[$.Germany, [[$.A($.Sil), { status: $.Dislodged, attackedFrom: $.Pru.province }]]]],
        [[$.Pru.province, $.Standoff]]
      )
    )
  })
  it('DIAGRAM 18', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.Germany, [$.A($.Ber), $.A($.Mun)]],
          [$.Russia, [$.A($.Pru), $.A($.Sil), $.A($.Boh), $.A($.Tyr)]]
        ],
        [], [], []
      ),
      [
        $.A($.Ber).hold(), $.A($.Mun).move($.Sil),
        $.A($.Pru).move($.Ber), $.A($.Sil).support($.A($.Pru).move($.Ber)),
        $.A($.Boh).move($.Mun), $.A($.Tyr).support($.A($.Boh).move($.Mun))
      ]
    )

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Sil).support($.A($.Pru).move($.Ber)), $.Cut],
        [$.A($.Mun).move($.Sil), $.Dislodged],
        [$.A($.Ber).hold(), $.Success],
        [$.A($.Pru).move($.Ber), $.Bounced],
        [$.A($.Boh).move($.Mun), $.Success],
        [$.A($.Tyr).support($.A($.Boh).move($.Mun)), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.Germany, [$.A($.Ber)]],
          [$.Russia, [$.A($.Pru), $.A($.Sil), $.A($.Mun), $.A($.Tyr)]]
        ],
        [],
        [[$.Germany, [[$.A($.Mun), { status: $.Dislodged, attackedFrom: $.Boh.province }]]]],
        []
      )
    )
  })
})
