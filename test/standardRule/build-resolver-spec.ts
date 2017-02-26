import * as chai from "chai"
import { BuildResolver } from "./../../src/standardRule/build-resolver"
import { standardRule } from "./../../src/standardRule"
import { rule } from "./../../src/rule"
import { standardMap } from "./../../src/standardMap"
import { standardBoard } from "./../../src/standardBoard"

const {
  Board, Unit, MilitaryBranch, State, Result, Phase, ProvinceStatus, StandardRuleHelper: Helper
} = standardRule
const { locations: $, Power, map } = standardMap
const { Season, Turn } = standardBoard
const { Executed } = rule
const { Army, Fleet } = MilitaryBranch
const { Build, Movement } = Phase

const should = chai.should()

const resolver = new BuildResolver()

describe("A BuildResolver", () => {
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
  it("resolves a build order", () => {
    const result = resolver.resolve(board, new Set([$$.F($.Rom).build()]))
    Array.from(result.result.results).should.have.deep.members([
      new Executed($$.F($.Rom).build(), Result.Success)
    ])
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
  it("resolves a disband order", () => {
    const result = resolver.resolve(board, new Set([$$.A($.Mun).disband()]))
    Array.from(result.result.results).should.have.deep.members([
      new Executed($$.A($.Mun).disband(), Result.Success)
    ])
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
