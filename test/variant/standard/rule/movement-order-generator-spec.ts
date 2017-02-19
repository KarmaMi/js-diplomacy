import * as chai from "chai"
import { MovementOrderGenerator } from "../../../../src/variant/standard/rule/movement-order-generator"
import { StandardRuleHelper as Helper } from "../../../../src/variant/standard/rule/standard-rule-helper"
import { Board, Unit } from "./../../../../src/variant/standard/rule/types"
import { MilitaryBranch } from "./../../../../src/variant/standard/rule/military-branch"
import { State } from "./../../../../src/variant/standard/rule/state"
import { Disband } from "./../../../../src/variant/standard/rule/order"
import { Phase } from "./../../../../src/variant/standard/rule/phase"
import { ProvinceStatus } from "./../../../../src/variant/standard/rule/province-status"
import { Season, Turn } from "./../../../../src/variant/standard/board/module"
import { locations as $, Power, map } from "./../../../../src/variant/standard/map/module"

const { Army, Fleet } = MilitaryBranch
const { Movement } = Phase

const should = chai.should()

const generator = new MovementOrderGenerator()

describe("A MovementOrderGenerator", () => {
  const board = new Board<Power>(
    map, new State(new Turn(1901, Season.Spring), Movement),
    [
      new Unit(Army, $.Spa, Power.France),
      new Unit(Fleet, $.GoL, Power.France)
    ],
    [], []
  )
  const $$ = new Helper(board)
  it("uses Hold as a default order", () => {
    generator.defaultOrderOf(board, $$.A($.Spa).unit).should.deep.equal($$.A($.Spa).hold())
    generator.defaultOrderOf(board, $$.F($.GoL).unit).should.deep.equal($$.F($.GoL).hold())
  })
  describe("when there are no units", () => {
    const board = new Board(
      map, new State(new Turn(1901, Season.Spring), Movement),
      [], [], []
    )
    it("uses an empty set to skip the movement phase", () => {
      const orders = generator.ordersToSkipPhase(board)
      should.not.equal(orders, null)
      if (orders) {
        Array.from(orders).should.have.deep.members([])
      }
    })
  })
  describe("when there are some units", () => {
    it("does not skip the movement phase", () => {
      should.equal(generator.ordersToSkipPhase(board), null)
    })
  })
})
