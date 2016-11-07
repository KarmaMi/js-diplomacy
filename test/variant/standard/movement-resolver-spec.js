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
      [[$.A($.Ber).move($.Sil), $.Bounced], [$.A($.War).move($.Sil), $.Bounced]]
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
        [$.A($.Pru).hold(), $.Success],
        [$.A($.Ber).move($.Pru), $.Bounced],
        [$.A($.Kie).move($.Ber), $.Bounced]
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
        [$.A($.Pru).move($.Ber), $.Bounced],
        [$.A($.Ber).move($.Pru), $.Bounced]
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
        [$.A($.Bur).hold(), $.Dislodged],
        [$.A($.Mar).move($.Bur), $.Success],
        [$.A($.Gas).support($.A($.Mar).move($.Bur)), $.Success]
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
        [$.A($.Pru).hold(), $.Dislodged],
        [$.A($.Sil).move($.Pru), $.Success],
        [$.F($.Bal).support($.A($.Sil).move($.Pru)), $.Success]
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
        [$.F($.GoL).move($.Tyn), $.Bounced],
        [$.F($.Wes).support($.F($.GoL).move($.Tyn)), $.Failed],
        [$.F($.Nap).move($.Tyn), $.Bounced],
        [$.F($.Rom).support($.F($.Nap).move($.Tyn)), $.Failed]
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
        [$.F($.Tyn).hold(), $.Success],
        [$.F($.Rom).support($.F($.Tyn).hold()), $.Success],
        [$.F($.GoL).move($.Tyn), $.Bounced],
        [$.F($.Wes).support($.F($.GoL).move($.Tyn)), $.Failed]
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
        [$.A($.Mun).move($.Sil), $.Dislodged],
        [$.A($.Ber).support($.A($.Mun).move($.Sil)), $.Failed],
        [$.A($.War).move($.Sil), $.Bounced],
        [$.A($.Pru).support($.A($.War).move($.Sil)), $.Failed],
        [$.A($.Boh).move($.Mun), $.Success],
        [$.A($.Tyr).support($.A($.Boh).move($.Mun)), $.Success]
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
        [$.A($.Bul).move($.Rum), $.Dislodged],
        [$.A($.Rum).move($.Bul), $.Success],
        [$.A($.Ser).support($.A($.Rum).move($.Bul)), $.Success],
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
        [$.A($.Bul).move($.Rum), $.Dislodged],
        [$.A($.Rum).move($.Bul), $.Success],
        [$.A($.Ser).support($.A($.Rum).move($.Bul)), $.Success],
        [$.A($.Gre).support($.A($.Rum).move($.Bul)), $.Success],
        [$.F($.Bla).support($.A($.Bul).move($.Rum)), $.Failed],
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
        [$.A($.Boh).move($.Sil), $.Bounced],
        [$.A($.War).hold(), $.Success],
        [$.A($.Pru).move($.War), $.Bounced]
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

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.War).move($.Sil), $.Dislodged],
        [$.A($.Pru).move($.War), $.Success],
        [$.A($.Sil).support($.A($.Pru).move($.War)), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.Germany, [$.A($.War), $.A($.Sil)]], [$.Russia, []]],
        [], [[$.A($.War), $.Dislodged]], []
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

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Sil).support($.A($.Ber).move($.Pru)), $.Dislodged],
        [$.A($.Pru).move($.Sil), $.Success],
        [$.A($.War).support($.A($.Pru).move($.Sil)), $.Success],
        [$.A($.Ber).move($.Pru), $.Bounced],
        [$.F($.Bal).move($.Pru), $.Bounced]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.Germany, [$.A($.Ber)]], [$.Russia, [$.F($.Bal), $.A($.Sil), $.A($.War)]]],
        [], [[$.A($.Sil), $.Dislodged]], [[$.Pru.province, $.Standoff]]
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

    ResolverSpecUtil.checkOrderResult(
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
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.Germany, [$.A($.Ber)]],
          [$.Russia, [$.A($.Pru), $.A($.Sil), $.A($.Mun), $.A($.Tyr)]]
        ],
        [], [[$.A($.Mun), $.Dislodged]], []
      )
    )
  })
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
        [$.A($.Lon).move($.Nwy), $.Success],
        [$.F($.Nth).convoy($.A($.Lon).move($.Nwy)), $.Success]
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
        $.A($.Lon).move($.Tun),
        $.F($.Eng).convoy($.A($.Lon).move($.Tun)),
        $.F($.Mid).convoy($.A($.Lon).move($.Tun)),
        $.F($.Wes).convoy($.A($.Lon).move($.Tun))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Lon).move($.Tun), $.Success],
        [$.F($.Eng).convoy($.A($.Lon).move($.Tun)), $.Success],
        [$.F($.Mid).convoy($.A($.Lon).move($.Tun)), $.Success],
        [$.F($.Wes).convoy($.A($.Lon).move($.Tun)), $.Success]
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
        [$.F($.Tyn).convoy($.A($.Spa).move($.Nap)), $.Dislodged],
        [$.F($.Ion).move($.Tyn), $.Success],
        [$.F($.Tun).support($.F($.Ion).move($.Tyn)), $.Success],
        [$.A($.Spa).move($.Nap), $.Failed],
        [$.F($.GoL).convoy($.A($.Spa).move($.Nap)), $.Failed]
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
})
