import * as chai from "chai"
import {
  RetreatValidator, Board, Unit, MilitaryBranch, State, Result, Phase, ProvinceStatus, Dislodged,
  StandardRuleHelper as Helper
} from "../../../../src/variant/standard/rule/module"
import * as Order from "./../../../../src/variant/standard/rule/order"
import * as Error from "./../../../../src/variant/standard/rule/error"
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
        new Error.CannotBeOrdered(new Order.Disband(u1)).should.deep.equal(
          validator.errorMessageOfOrder(board, new Order.Disband(u1))
        )
      })
    })
    describe("an order that its target retreats to an invalid location", () => {
      it("returns an error message", () => {
        new Error.UnmovableLocation($$.A($.Mar).unit, $.Gas).should.deep.equal(
          validator.errorMessageOfOrder(board, $$.A($.Mar).retreat($.Gas))
        )
      })
    })
    describe("a set of orders that some dislodged unit have no order", () => {
      it("returns an error message", () => {
        new Error.OrderNotExisted($$.F($.Wes).unit).should.deep.equal(
          validator.errorMessageOfOrders(board, new Set([$$.A($.Mar).retreat($.Gas)]))
        )
      })
    })
  })
})
