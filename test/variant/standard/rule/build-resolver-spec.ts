import * as chai from "chai"
import { BuildResolver } from "../../../../src/variant/standard/rule/build-resolver"
import { StandardRuleHelper as Helper } from "../../../../src/variant/standard/rule/standard-rule-helper"
import { Board, Unit } from "./../../../../src/variant/standard/rule/types"
import { MilitaryBranch } from "./../../../../src/variant/standard/rule/military-branch"
import { State } from "./../../../../src/variant/standard/rule/state"
import { Disband } from "./../../../../src/variant/standard/rule/order"
import { Result } from "./../../../../src/variant/standard/rule/result"
import { Phase } from "./../../../../src/variant/standard/rule/phase"
import { ProvinceStatus } from "./../../../../src/variant/standard/rule/province-status"
import { Executed } from "./../../../../src/rule/module"
import { locations as $, Power, map } from "./../../../../src/variant/standard/map/module"
import { Season, Turn } from "./../../../../src/variant/standard/board/module"

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
