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

describe('MovementResolver#Rare Cases and Tricky Situations', () => {
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
        new State(1901, $.Spring, $.Retreat),
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
        [$.A($.Par).move($.Bur), $.Bounced],
        [$.A($.Ruh).support($.A($.Par).move($.Bur)), $.Failed],
        [$.A($.Mar).move($.Bur), $.Bounced],
        [$.A($.Bur).move($.Mar), $.Bounced]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
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
        new State(1901, $.Spring, $.Retreat),
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
        [$.A($.Sil).move($.Mun), $.Bounced],
        [$.A($.Boh).support($.A($.Sil).move($.Mun)), $.Failed],
        [$.A($.Tyr).move($.Mun), $.Bounced],
        [$.A($.Ruh).move($.Mun), $.Bounced],
        [$.A($.Mun).move($.Tyr), $.Bounced]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
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
        new State(1901, $.Spring, $.Retreat),
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
        new State(1901, $.Spring, $.Retreat),
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
        [$.F($.Nth).convoy($.A($.Lon).move($.Bel)), $.Success],
        [$.F($.Eng).convoy($.A($.Bel).move($.Lon)), $.Success],
        [$.A($.Bel).move($.Lon), $.Success],
        [$.A($.Lon).move($.Bel), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.England, [$.A($.Bel), $.F($.Nth)]], [$.France, [$.A($.Lon), $.F($.Eng)]]],
        [], [], []
      )
    )
  })
  it('DIAGRAM 29', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.England, [$.A($.Lon), $.F($.Nth), $.F($.Eng)]], [$.France, [$.F($.Bre), $.F($.Iri)]]],
        [], [], []
      ),
      [
        $.A($.Lon).move($.Bel),
        $.F($.Nth).convoy($.A($.Lon).move($.Bel)), $.F($.Eng).convoy($.A($.Lon).move($.Bel)),
        $.F($.Bre).move($.Eng), $.F($.Iri).support($.F($.Bre).move($.Eng))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Nth).convoy($.A($.Lon).move($.Bel)), $.Success],
        [$.F($.Eng).convoy($.A($.Lon).move($.Bel)), $.Dislodged],
        [$.F($.Bre).move($.Eng), $.Success],
        [$.F($.Iri).support($.F($.Bre).move($.Eng)), $.Success],
        [$.A($.Lon).move($.Bel), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.England, [$.A($.Bel), $.F($.Nth)]], [$.France, [$.F($.Eng), $.F($.Iri)]]],
        [],
        [[$.England, [[$.F($.Eng), { status: $.Dislodged, attackedFrom: $.Bre.province }]]]],
        []
      )
    )
  })
  it('DIAGRAM 30', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.France, [$.A($.Tun), $.F($.Tyn)]],
          [$.Italy, [$.F($.Ion), $.F($.Nap)]]
        ],
        [], [], []
      ),
      [
        $.A($.Tun).move($.Nap), $.F($.Tyn).convoy($.A($.Tun).move($.Nap)),
        $.F($.Ion).move($.Tyn), $.F($.Nap).support($.F($.Ion).move($.Tyn))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Tyn).convoy($.A($.Tun).move($.Nap)), $.Dislodged],
        [$.F($.Ion).move($.Tyn), $.Success],
        [$.F($.Nap).support($.F($.Ion).move($.Tyn)), $.Success],
        [$.A($.Tun).move($.Nap), $.Failed]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.France, [$.A($.Tun)]],
          [$.Italy, [$.F($.Tyn), $.F($.Nap)]]
        ],
        [],
        [[$.France, [[$.F($.Tyn), { status: $.Dislodged, attackedFrom: $.Ion.province }]]]],
        []
      )
    )
  })
  it('DIAGRAM 31', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.France, [$.A($.Tun), $.F($.Tyn), $.F($.Ion)]],
          [$.Italy, [$.F($.Rom), $.F($.Nap)]]
        ],
        [], [], []
      ),
      [
        $.A($.Tun).move($.Nap),
        $.F($.Tyn).convoy($.A($.Tun).move($.Nap)), $.F($.Ion).convoy($.A($.Tun).move($.Nap)),
        $.F($.Rom).move($.Tyn), $.F($.Nap).support($.F($.Rom).move($.Tyn))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Ion).convoy($.A($.Tun).move($.Nap)), $.Failed],
        [$.F($.Nap).support($.F($.Rom).move($.Tyn)), $.Cut],
        [$.F($.Tyn).convoy($.A($.Tun).move($.Nap)), $.Failed],
        [$.F($.Rom).move($.Tyn), $.Bounced],
        [$.A($.Tun).move($.Nap), $.Bounced]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.France, [$.A($.Tun), $.F($.Tyn), $.F($.Ion)]],
          [$.Italy, [$.F($.Rom), $.F($.Nap)]]
        ],
        [], [], []
      )
    )
  })
  it('DIAGRAM 32', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.France, [$.A($.Tun), $.F($.Tyn), $.F($.Ion), $.A($.Apu)]],
          [$.Italy, [$.F($.Rom), $.F($.Nap)]]
        ],
        [], [], []
      ),
      [
        $.A($.Tun).move($.Nap), $.A($.Apu).support($.A($.Tun).move($.Nap)),
        $.F($.Tyn).convoy($.A($.Tun).move($.Nap)), $.F($.Ion).convoy($.A($.Tun).move($.Nap)),
        $.F($.Rom).move($.Tyn), $.F($.Nap).support($.F($.Rom).move($.Tyn))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Ion).convoy($.A($.Tun).move($.Nap)), $.Success],
        [$.F($.Nap).support($.F($.Rom).move($.Tyn)), $.Dislodged],
        [$.F($.Tyn).convoy($.A($.Tun).move($.Nap)), $.Success],
        [$.F($.Rom).move($.Tyn), $.Bounced],
        [$.A($.Tun).move($.Nap), $.Success],
        [$.A($.Apu).support($.A($.Tun).move($.Nap)), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.France, [$.A($.Nap), $.F($.Tyn), $.F($.Ion), $.A($.Apu)]],
          [$.Italy, [$.F($.Rom)]]
        ],
        [],
        [[$.Italy, [[$.F($.Nap), { status: $.Dislodged, attackedFrom: $.Tun.province }]]]],
        []
      )
    )
  })
})
