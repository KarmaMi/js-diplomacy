import * as chai from "chai"
import { RetreatValidator } from "../../../../src/variant/standard/rule/retreat-validator"
import { StandardRuleHelper as Helper } from "../../../../src/variant/standard/rule/standard-rule-helper"
import { Board, Unit } from "./../../../../src/variant/standard/rule/types"
import { MilitaryBranch } from "./../../../../src/variant/standard/rule/military-branch"
import { State } from "./../../../../src/variant/standard/rule/state"
import * as Order from "./../../../../src/variant/standard/rule/order"
import { Result } from "./../../../../src/variant/standard/rule/result"
import { Phase } from "./../../../../src/variant/standard/rule/phase"
import { Dislodged } from "./../../../../src/variant/standard/rule/dislodged"
import { ProvinceStatus } from "./../../../../src/variant/standard/rule/province-status"
import { Executed } from "./../../../../src/rule/module"
import { locations as $, Power, map } from "./../../../../src/variant/standard/map/module"
import { Season, Turn } from "./../../../../src/variant/standard/board/module"

const { Army, Fleet } = MilitaryBranch
const { Retreat } = Phase

const should = chai.should()

const validator = new RetreatValidator()

describe("A RetreatValidator", () => {
  const u1 = new Unit(Army, $.Bur, Power.France)
  const u2 = new Unit(Army, $.Mar, Power.France)
  const u3 = new Unit(Fleet, $.Wes, Power.Italy)
  const board = new Board<Power>(
    map, new State(new Turn(1901, Season.Autumn), Retreat),
    [u1, u2, u3],
    [
      [u2, new Dislodged($.Gas.province)], [u3, new Dislodged($.Tyn.province)]
    ],
    [[$.Pie.province, new ProvinceStatus(null, true)]]
  )
  const $$ = new Helper(board)
  describe("when a valid order is received", () => {
    it("returns null (1)", () => {
      should.equal(
        validator.errorMessageOfOrder(board, $$.A($.Mar).retreat($.Spa)), null
      )
    })
    it("returns null (2)", () => {
      should.equal(
        validator.errorMessageOfOrder(board, $$.A($.Mar).disband()), null
      )
    })
    describe("an order that its target is not dislodged is received", () => {
      it("returns an error message", () => {
        should.equal(
          validator.errorMessageOfOrder(board, new Order.Disband(u1)),
          "A Bur is not dislodged"
        )
      })
    })
    describe("an order that its target retreats to an invalid location", () => {
      it("returns an error message", () => {
        should.equal(
          validator.errorMessageOfOrder(board, $$.A($.Mar).retreat($.Gas)),
          "A Mar cannot retreat to Gas"
        )
      })
    })
    describe("a set of orders that some dislodged unit have no order", () => {
      it("returns an error message", () => {
        should.equal(
          validator.errorMessageOfOrders(board, new Set([$$.A($.Mar).retreat($.Gas)])),
          "F Wes has no order"
        )
      })
    })
  })
})
