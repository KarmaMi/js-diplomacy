import * as chai from "chai"
import { RetreatOrderGenerator } from "../../../../src/variant/standard/rule/retreat-order-generator"
import { StandardRuleHelper as Helper } from "../../../../src/variant/standard/rule/standard-rule-helper"
import { Board, Unit } from "./../../../../src/variant/standard/rule/types"
import { MilitaryBranch } from "./../../../../src/variant/standard/rule/military-branch"
import { State } from "./../../../../src/variant/standard/rule/state"
import { Disband } from "./../../../../src/variant/standard/rule/order"
import { Dislodged } from "./../../../../src/variant/standard/rule/dislodged"
import { Phase } from "./../../../../src/variant/standard/rule/phase"
import { ProvinceStatus } from "./../../../../src/variant/standard/rule/province-status"
import { Season, Turn } from "./../../../../src/variant/standard/board/module"
import { locations as $, Power, map } from "./../../../../src/variant/standard/map/module"

const { Army, Fleet } = MilitaryBranch
const { Retreat } = Phase

const should = chai.should()
const generator = new RetreatOrderGenerator()

describe("A RetreatOrderGenerator", () => {
  it("uses Disband as a default order", () => {
    const u1 = new Unit(Army, $.Mar, Power.France)
    const u2 = new Unit(Fleet, $.Wes, Power.Italy)
    const board = new Board<Power>(
      map, new State(new Turn(1901, Season.Spring), Retreat),
      [
        new Unit(Army, $.Bur, Power.France),
        u1,
        u2
      ],
      [
        [u1, new Dislodged($.Gas.province)], [u2, new Dislodged($.Tyn.province)]
      ],
      [[$.Pie.province, new ProvinceStatus(null, true)]]
    )
    const $$ = new Helper(board)
    generator.defaultOrderOf(board, $$.A($.Mar).unit).should.deep.equal($$.A($.Mar).disband())
    generator.defaultOrderOf(board, $$.F($.Wes).unit).should.deep.equal($$.F($.Wes).disband())
  })
  describe("when all dislodged units cannot retreat", () => {
    it("uses disband orders to skip the retreat phase", () => {
      const u1 = new Unit(Army, $.Bre, Power.France)
      const board = new Board<Power>(
        map, new State(new Turn(1901, Season.Spring), Retreat),
        [
          new Unit(Army, $.Par, Power.Germany),
          new Unit(Army, $.Gas, Power.Germany),
          new Unit(Army, $.Bre, Power.Germany),
          u1
        ],
        [[u1, new Dislodged($.Pic.province)]],
        []
      )
      const $$ = new Helper(board)
      const orders = generator.ordersToSkipPhase(board)
      should.not.equal(orders, null)
      if (orders) {
      Array.from(orders).should.have.deep.members([$$.A($.Bre).disband()])
      }
    })
  })
  describe("there  are some units that can retreat", () => {
    it("does not skip the retreat phase", () => {
      const u1 = new Unit(Army, $.Mar, Power.France)
      const u2 = new Unit(Fleet, $.Wes, Power.Italy)
      const board = new Board<Power>(
        map, new State(new Turn(1901, Season.Spring), Retreat),
        [
          new Unit(Army, $.Bur, Power.France),
          u1,
          u2
        ],
        [
          [u1, new Dislodged($.Gas.province)], [u2, new Dislodged($.Tyn.province)]
        ],
        [[$.Pie.province, new ProvinceStatus(null, true)]]
      );
      (generator.ordersToSkipPhase(board) === null).should.equal(true)
    })
  })
})
