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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Bur).hold(), $.Success],
        [$.A($.Par).move($.Bur), $.Bounced],
        [$.A($.Mar).support($.A($.Par).move($.Bur)), $.Failed]
      ]
    )
    StandardSpecUtil.checkBoard(
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Par).move($.Bur), $.Bounced],
        [$.A($.Ruh).support($.A($.Par).move($.Bur)), $.Failed],
        [$.A($.Mar).move($.Bur), $.Bounced],
        [$.A($.Bur).move($.Mar), $.Bounced]
      ]
    )
    StandardSpecUtil.checkBoard(
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Bur).hold(), $.Success],
        [$.A($.Ruh).move($.Bur), $.Bounced],
        [$.A($.Par).support($.A($.Ruh).move($.Bur)), $.Failed],
        [$.A($.Mun).hold(), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Sil).move($.Mun), $.Bounced],
        [$.A($.Boh).support($.A($.Sil).move($.Mun)), $.Failed],
        [$.A($.Tyr).move($.Mun), $.Bounced],
        [$.A($.Ruh).move($.Mun), $.Bounced],
        [$.A($.Mun).move($.Tyr), $.Bounced]
      ]
    )
    StandardSpecUtil.checkBoard(
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

    StandardSpecUtil.checkOrderResult(
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
    StandardSpecUtil.checkBoard(
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Vie).move($.Bud), $.Bounced],
        [$.A($.Ser).move($.Bud), $.Success],
        [$.A($.Gal).support($.A($.Ser).move($.Bud)), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Nth).convoy($.A($.Lon).move($.Bel)), $.Success],
        [$.F($.Eng).convoy($.A($.Bel).move($.Lon)), $.Success],
        [$.A($.Bel).move($.Lon), $.Success],
        [$.A($.Lon).move($.Bel), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Nth).convoy($.A($.Lon).move($.Bel)), $.Success],
        [$.F($.Eng).convoy($.A($.Lon).move($.Bel)), $.Dislodged],
        [$.F($.Bre).move($.Eng), $.Success],
        [$.F($.Iri).support($.F($.Bre).move($.Eng)), $.Success],
        [$.A($.Lon).move($.Bel), $.Success]
      ]
    )
    StandardSpecUtil.checkBoard(
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Tyn).convoy($.A($.Tun).move($.Nap)), $.Dislodged],
        [$.F($.Ion).move($.Tyn), $.Success],
        [$.F($.Nap).support($.F($.Ion).move($.Tyn)), $.Success],
        [$.A($.Tun).move($.Nap), $.Failed]
      ]
    )
    StandardSpecUtil.checkBoard(
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

    StandardSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Ion).convoy($.A($.Tun).move($.Nap)), $.Failed],
        [$.F($.Nap).support($.F($.Rom).move($.Tyn)), $.Cut],
        [$.F($.Tyn).convoy($.A($.Tun).move($.Nap)), $.Failed],
        [$.F($.Rom).move($.Tyn), $.Bounced],
        [$.A($.Tun).move($.Nap), $.Bounced]
      ]
    )
    StandardSpecUtil.checkBoard(
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

    StandardSpecUtil.checkOrderResult(
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
    StandardSpecUtil.checkBoard(
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
