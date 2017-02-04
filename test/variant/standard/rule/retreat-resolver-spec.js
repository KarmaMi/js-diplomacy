'use strict'

const chai = require('chai')

const { Board, Unit } = require('../../../../lib/board/package')
const { OrderResult: { Executed } } = require('../../../../lib/rule/package')
const { map, location, Power } = require('../../../../lib/variant/standard/map/package')
const { Turn, Season } = require('../../../../lib/variant/standard/board/package')
const { Army, Fleet } = require('../../../../lib/variant/standard/rule/military-branch')
const { Retreat, Build, Movement } = require('../../../../lib/variant/standard/rule/phase')
const Dislodged = require('../../../../lib/variant/standard/rule/dislodged')
const ProvinceStatus = require('../../../../lib/variant/standard/rule/province-status')
const State = require('../../../../lib/variant/standard/rule/state')
const Result = require('../../../../lib/variant/standard/rule/result')
const RetreatResolver = require('../../../../lib/variant/standard/rule/retreat-resolver')
const Helper = require('../../../../lib/variant/standard/rule/standard-rule-helper')

chai.should()

const $ = location
const resolver = new RetreatResolver()

describe('A RetreatResolver', () => {
  const u1 = new Unit(Army, $.Mar, Power.Germany)
  const u2 = new Unit(Fleet, $.Wes, Power.Italy)
  const board = new Board(
    map, new State(new Turn(1901, Season.Spring), Retreat),
    [
      new Unit(Army, $.Bur, Power.Germany),
      u1,
      u2
    ],
    [
      [u1, new Dislodged($.Gas.province)], [u2, new Dislodged($.Tyn.province)]
    ],
    [[$.Pie.province, new ProvinceStatus(null, true)]]
  )
  const $$ = new Helper(board)
  describe('A RetreatResolver', () => {
    it('resolves a disband order', () => {
      const result = resolver.resolve(board, [$$.A($.Mar).disband(), $$.F($.Wes).disband()]).result
      result.results.should.deep.equal(new Set([
        new Executed($$.A($.Mar).disband(), Result.Success),
        new Executed($$.F($.Wes).disband(), Result.Success)
      ]))
      result.board.should.deep.equal(new Board(
        map, new State(new Turn(1901, Season.Autumn), Movement),
        [new Unit(Army, $.Bur, Power.Germany)],
        [], []
      ))
    })
    it('resolves a retreat order (1)', () => {
      const result = resolver.resolve(
        board, [$$.A($.Mar).retreat($.Spa), $$.F($.Wes).retreat($.NAf)]
      ).result
      result.results.should.deep.equal(new Set([
        new Executed($$.A($.Mar).retreat($.Spa), Result.Success),
        new Executed($$.F($.Wes).retreat($.NAf), Result.Success)
      ]))
      result.board.should.deep.equal(new Board(
        map, new State(new Turn(1901, Season.Autumn), Movement),
        [
          new Unit(Army, $.Bur, Power.Germany),
          new Unit(Army, $.Spa, Power.Germany),
          new Unit(Fleet, $.NAf, Power.Italy)
        ],
        [], []
      ))
    })
    it('resolves a retreat order (2)', () => {
      const result = resolver.resolve(
        board, [$$.A($.Mar).retreat($.Spa), $$.F($.Wes).retreat($.Spa)]
      ).result
      result.results.should.deep.equal(new Set([
        new Executed($$.A($.Mar).retreat($.Spa), Result.Failed),
        new Executed($$.F($.Wes).retreat($.Spa), Result.Failed)
      ]))
      result.board.should.deep.equal(new Board(
        map, new State(new Turn(1901, Season.Autumn), Movement),
        [new Unit(Army, $.Bur, Power.Germany)],
        [], []
      ))
    })
  })
  describe('when resolves a buildable turn', () => {
    it('go to Build phase', () => {
      const board = new Board(
        map, new State(new Turn(1901, Season.Autumn), Retreat),
        [], [], []
      )
      const result = resolver.resolve(board, []).result
      result.board.state.should.deep.equal(new State(new Turn(1901, Season.Autumn), Build))
    })
  })
  describe('when a power controls half of supply centers', () => {
    it('finish the game', () => {
      const board = new Board(
        map, new State(new Turn(1901, Season.Autumn), Retreat),
        [], [],
        [
          [$.StP.province, new ProvinceStatus(Power.France, false)],
          [$.Swe.province, new ProvinceStatus(Power.France, false)],
          [$.Nwy.province, new ProvinceStatus(Power.France, false)],
          [$.Den.province, new ProvinceStatus(Power.France, false)],
          [$.Lvp.province, new ProvinceStatus(Power.France, false)],
          [$.Edi.province, new ProvinceStatus(Power.France, false)],
          [$.Lon.province, new ProvinceStatus(Power.France, false)],
          [$.Ber.province, new ProvinceStatus(Power.France, false)],
          [$.Kie.province, new ProvinceStatus(Power.France, false)],
          [$.Mun.province, new ProvinceStatus(Power.France, false)],
          [$.Hol.province, new ProvinceStatus(Power.France, false)],
          [$.Bel.province, new ProvinceStatus(Power.France, false)],
          [$.Bre.province, new ProvinceStatus(Power.France, false)],
          [$.Par.province, new ProvinceStatus(Power.France, false)],
          [$.Mar.province, new ProvinceStatus(Power.France, false)],
          [$.Spa.province, new ProvinceStatus(Power.France, false)],
          [$.Por.province, new ProvinceStatus(Power.France, false)],
          [$.Tun.province, new ProvinceStatus(Power.France, false)]
        ]
      )
      const result = resolver.resolve(board, []).result
      result.isFinished.should.equal(true)
    })
  })
})
