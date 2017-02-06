'use strict'

const chai = require('chai')

const { Board, Unit } = require('../../../../lib/board/package')
const { OrderResult: { Executed } } = require('../../../../lib/rule/package')
const { map, location, Power } = require('../../../../lib/variant/standard/map/package')
const { Turn, Season } = require('../../../../lib/variant/standard/board/package')
const { Army, Fleet } = require('../../../../lib/variant/standard/rule/military-branch')
const { Build, Movement } = require('../../../../lib/variant/standard/rule/phase')
const ProvinceStatus = require('../../../../lib/variant/standard/rule/province-status')
const State = require('../../../../lib/variant/standard/rule/state')
const Result = require('../../../../lib/variant/standard/rule/result')
const BuildResolver = require('../../../../lib/variant/standard/rule/build-resolver')
const Helper = require('../../../../lib/variant/standard/rule/standard-rule-helper')

chai.should()

const $ = location
const resolver = new BuildResolver()

describe('A BuildResolver', () => {
  const board = new Board(
    map, new State(new Turn(1901, Season.Autumn), Build),
    [
      new Unit(Army, $.Mun, Power.Germany),
      new Unit(Fleet, $.Nap, Power.Italy)
    ],
    [],
    [
      [$.Rom.province, new ProvinceStatus(Power.Italy, false)],
      [$.Nap.province, new ProvinceStatus(Power.Italy, false)],
      [$.Mar.province, new ProvinceStatus(Power.France, false)]
    ]
  )
  const $$ = new Helper(board)
  it('resolves a build order', () => {
    const result = resolver.resolve(board, [$$.F($.Rom).build()])
    result.result.results.should.deep.equal(new Set([
      new Executed($$.F($.Rom).build(), Result.Success)
    ]))
    result.result.board.should.deep.equal(new Board(
      map, new State(new Turn(1902, Season.Spring), Movement),
      [
        new Unit(Army, $.Mun, Power.Germany),
        new Unit(Fleet, $.Nap, Power.Italy),
        new Unit(Fleet, $.Rom, Power.Italy)
      ],
      [],
      [
        [$.Rom.province, new ProvinceStatus(Power.Italy, false)],
        [$.Nap.province, new ProvinceStatus(Power.Italy, false)],
        [$.Mar.province, new ProvinceStatus(Power.France, false)]
      ]
    ))
  })
  it('resolves a disband order', () => {
    const result = resolver.resolve(board, [$$.A($.Mun).disband()])
    result.result.results.should.deep.equal(new Set([
      new Executed($$.A($.Mun).disband(), Result.Success)
    ]))
    result.result.board.should.deep.equal(new Board(
      map, new State(new Turn(1902, Season.Spring), Movement),
      [new Unit(Fleet, $.Nap, Power.Italy)],
      [],
      [
        [$.Rom.province, new ProvinceStatus(Power.Italy, false)],
        [$.Nap.province, new ProvinceStatus(Power.Italy, false)],
        [$.Mar.province, new ProvinceStatus(Power.France, false)]
      ]
    ))
  })
})
