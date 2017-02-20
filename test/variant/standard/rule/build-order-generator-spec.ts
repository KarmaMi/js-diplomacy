import * as chai from "chai"
import {
  BuildOrderGenerator, Board, Unit, MilitaryBranch, State, Disband, Phase, ProvinceStatus,
  StandardRuleHelper as Helper
} from "../../../../src/variant/standard/rule/module"
import { locations as $, Power, map } from "./../../../../src/variant/standard/map/module"

const { Army } = MilitaryBranch
const { France, England } = Power

const should = chai.should()

const turn = {
  isBuildable: true,
  isOccupationUpdateable: true,
  nextTurn: () => this
}

const state = new State(turn, Phase.Movement)

const generator = new BuildOrderGenerator<Power>()

describe("A MovementOrderGenerator", () => {
  describe("when there are no powers that can build or disband units", () => {
    it("uses an empty to skip the build phase.", () => {
      const board = new Board(map, state, [], [], [])
      should.not.equal(generator.ordersToSkipPhase(board), null)
      Array.from(generator.ordersToSkipPhase(board) || new Set()).should.have.deep.members([])
    })
  })
  describe("when all disband orders are automatically decidable", () => {
    it("uses disband order to skip the build phase.", () => {
      const board = new Board(map, state, [new Unit(Army, $.Ruh, Power.Germany)], [], [])
      Array.from(generator.ordersToSkipPhase(board) || new Set()).should.have.deep.members(
        [new Disband(new Unit(Army, $.Ruh, Power.Germany))]
      )
    })
  })
  describe("otherwise", () => {
    it("does not skip the build phase", () => {
      const board = new Board(
        map, state,
        [new Unit(Army, $.Ruh, Power.Germany)],
        [],
        [
          [$.Mun.province, new ProvinceStatus(Power.Germany, false)],
          [$.Ber.province, new ProvinceStatus(Power.Germany, false)]
        ]
      )
      should.equal(generator.ordersToSkipPhase(board), null)
    })
  })
})
