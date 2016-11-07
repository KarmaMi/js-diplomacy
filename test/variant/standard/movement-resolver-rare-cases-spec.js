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
  it('DIAGRAM 22', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.A($.Par), $.A($.Bur), $.A($.Mar)]]],
        [], [], []
      ),
      [$.A($.Par).move($.Bur), $.A($.Mar).support($.A($.Par).move($.Bur)), $.A($.Bur).hold()]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Bur).hold(), $.Success],
        [$.A($.Par).move($.Bur), $.Bounced],
        [$.A($.Mar).support($.A($.Par).move($.Bur)), $.Failed]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.A($.Par), $.A($.Bur), $.A($.Mar)]]],
        [], [], []
      )
    )
  })
  it('DIAGRAM 23', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.France, [$.A($.Par), $.A($.Bur)]],
          [$.Italy, [$.A($.Mar)]],
          [$.Germany, [$.A($.Ruh)]]
        ],
        [], [], []
      ),
      [
        $.A($.Par).move($.Bur),
        $.A($.Bur).move($.Mar),
        $.A($.Mar).move($.Bur),
        $.A($.Ruh).support($.A($.Par).move($.Bur))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Bur).move($.Mar), $.Bounced],
        [$.A($.Par).move($.Bur), $.Bounced],
        [$.A($.Ruh).support($.A($.Par).move($.Bur)), $.Failed],
        [$.A($.Mar).move($.Bur), $.Bounced]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [
          [$.France, [$.A($.Par), $.A($.Bur)]],
          [$.Italy, [$.A($.Mar)]],
          [$.Germany, [$.A($.Ruh)]]
        ],
        [], [], []
      )
    )
  })
  it('DIAGRAM 24', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.France, [$.A($.Par), $.A($.Bur)]],
          [$.Germany, [$.A($.Mun), $.A($.Ruh)]]
        ],
        [], [], []
      ),
      [
        $.A($.Par).support($.A($.Ruh).move($.Bur)),
        $.A($.Bur).hold(),
        $.A($.Mun).hold(),
        $.A($.Ruh).move($.Bur)
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Bur).hold(), $.Success],
        [$.A($.Ruh).move($.Bur), $.Bounced],
        [$.A($.Par).support($.A($.Ruh).move($.Bur)), $.Failed],
        [$.A($.Mun).hold(), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [
          [$.France, [$.A($.Par), $.A($.Bur)]],
          [$.Germany, [$.A($.Mun), $.A($.Ruh)]]
        ],
        [], [], []
      )
    )
  })
  it('DIAGRAM 25', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.Austria, [$.A($.Boh), $.A($.Tyr)]],
          [$.Germany, [$.A($.Ruh), $.A($.Mun), $.A($.Sil)]]
        ],
        [], [], []
      ),
      [
        $.A($.Boh).support($.A($.Sil).move($.Mun)), $.A($.Tyr).move($.Mun),
        $.A($.Mun).move($.Tyr), $.A($.Sil).move($.Mun), $.A($.Ruh).move($.Mun)
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Mun).move($.Tyr), $.Bounced],
        [$.A($.Sil).move($.Mun), $.Bounced],
        [$.A($.Boh).support($.A($.Sil).move($.Mun)), $.Failed],
        [$.A($.Tyr).move($.Mun), $.Bounced],
        [$.A($.Ruh).move($.Mun), $.Bounced]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [
          [$.Austria, [$.A($.Boh), $.A($.Tyr)]],
          [$.Germany, [$.A($.Ruh), $.A($.Mun), $.A($.Sil)]]
        ],
        [], [], []
      )
    )
  })
  it('DIAGRAM 26', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.England, [$.F($.Hel), $.F($.Nth), $.F($.Den)]],
          [$.Germany, [$.A($.Ber), $.F($.Ska)], $.F($.Bal)]
        ],
        [], [], []
      ),
      [
        $.F($.Den).move($.Kie), $.F($.Nth).move($.Den), $.F($.Hel).support($.F($.Nth).move($.Den)),
        $.A($.Ber).move($.Kie), $.F($.Ska).move($.Den), $.F($.Bal).support($.F($.Ska).move($.Den))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Den).move($.Kie), $.Bounced],
        [$.A($.Ber).move($.Kie), $.Bounced],
        [$.F($.Nth).move($.Den), $.Bounced],
        [$.F($.Hel).support($.F($.Nth).move($.Den)), $.Failed],
        [$.F($.Ska).move($.Den), $.Bounced],
        [$.F($.Bal).support($.F($.Ska).move($.Den)), $.Failed]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [
          [$.England, [$.F($.Hel), $.F($.Nth), $.F($.Den)]],
          [$.Germany, [$.A($.Ber), $.F($.Ska)], $.F($.Bal)]
        ],
        [], [], [[$.Kie.province, $.Standoff]]
      )
    )
  })
  it('DIAGRAM 27', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.Austria, [$.A($.Vie), $.A($.Ser)]],
          [$.Russia, [$.A($.Gal)]]
        ],
        [], [], []
      ),
      [
        $.A($.Vie).move($.Bud), $.A($.Ser).move($.Bud),
        $.A($.Gal).support($.A($.Ser).move($.Bud))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Vie).move($.Bud), $.Bounced],
        [$.A($.Ser).move($.Bud), $.Success],
        [$.A($.Gal).support($.A($.Ser).move($.Bud)), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [
          [$.Austria, [$.A($.Vie), $.A($.Bud)]],
          [$.Russia, [$.A($.Gal)]]
        ],
        [], [], []
      )
    )
  })
  it('DIAGRAM 28', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.England, [$.A($.Lon), $.F($.Nth)]], [$.France, [$.A($.Bel), $.F($.Eng)]]],
        [], [], []
      ),
      [
        $.A($.Lon).move($.Bel), $.F($.Nth).convoy($.A($.Lon).move($.Bel)),
        $.A($.Bel).move($.Lon), $.F($.Eng).convoy($.A($.Bel).move($.Lon))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Bel).move($.Lon), $.Success],
        [$.F($.Eng).convoy($.A($.Bel).move($.Lon)), $.Success],
        [$.A($.Lon).move($.Bel), $.Success],
        [$.F($.Nth).convoy($.A($.Lon).move($.Bel)), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.England, [$.A($.Bel), $.F($.Nth)]], [$.France, [$.A($.Lon), $.F($.Eng)]]],
        [], [], []
      )
    )
  })
})
