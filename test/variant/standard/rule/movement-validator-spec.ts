import * as chai from "chai"
import { MovementValidator } from "../../../../src/variant/standard/rule/movement-validator"
import { StandardRuleHelper as Helper } from "../../../../src/variant/standard/rule/standard-rule-helper"
import { Board, Unit } from "./../../../../src/variant/standard/rule/types"
import { MilitaryBranch } from "./../../../../src/variant/standard/rule/military-branch"
import { State } from "./../../../../src/variant/standard/rule/state"
import * as Order from "./../../../../src/variant/standard/rule/order"
import { Result } from "./../../../../src/variant/standard/rule/result"
import { Phase } from "./../../../../src/variant/standard/rule/phase"
import { Executed } from "./../../../../src/rule/module"
import { locations as $, Power, map } from "./../../../../src/variant/standard/map/module"
import { Season, Turn } from "./../../../../src/variant/standard/board/module"

const { Army, Fleet } = MilitaryBranch
const { Movement } = Phase

const should = chai.should()

const validator = new MovementValidator()

describe("A MovementValidator", () => {
  const board = new Board<Power>(
    map, new State(new Turn(1901, Season.Autumn), Movement),
    [
      new Unit(Army, $.Lvp, Power.England),
      new Unit(Fleet, $.Lon, Power.England),
      new Unit(Fleet, $.Mid, Power.England),
      new Unit(Fleet, $.Eng, Power.England),
      new Unit(Army, $.Spa, Power.France),
      new Unit(Army, $.Bur, Power.France)
    ],
    [], []
  )
  const $$ = new Helper(board)
  describe("a valid order is received", () => {
    it("returns null (1)", () => {
      should.equal(validator.errorMessageOfOrder(board, $$.A($.Lvp).move($.Yor)), null)
    })
    it("returns null (2)", () => {
      should.equal(validator.errorMessageOfOrder(board, $$.A($.Spa).move($.Wal)), null)
    })
  })
  describe("an order that its target unit does not exist is received", () => {
    it("returns an error message", () => {
      should.equal(
        validator.errorMessageOfOrder(board, new Order.Hold(new Unit(Army, $.Lon, Power.England))),
        "A Lon does not exist"
      )
    })
  })
  describe("a unit tries to move an invalid location", () => {
    it("returns an error message", () => {
      should.equal(
        validator.errorMessageOfOrder(board, $$.A($.Lvp).move($.Bud)),
        "A Lvp cannot move to Bud"
      )
    })
  })
  describe("a unit tries to support an invalid location", () => {
    it("returns an error message (1)", () => {
      should.equal(
        validator.errorMessageOfOrder(board, $$.A($.Lvp).support($$.A($.Spa).hold())),
        "A Lvp cannot support A Spa H"
      )
    })
    it("returns an error message (2)", () => {
      should.equal(
        validator.errorMessageOfOrder(board, $$.A($.Lvp).support($$.A($.Spa).move($.Bud))),
        "A Spa cannot move to Bud"
      )
    })
  })
  describe("a unit tries to convoy an invalid order", () => {
    it("returns an error message (1)", () => {
      should.equal(
        validator.errorMessageOfOrder(board, $$.A($.Lvp).convoy($$.F($.Lon).move($.Yor))),
        "A Lvp is not fleet"
      )
    })
    it("returns an error message (2)", () => {
      should.equal(
        validator.errorMessageOfOrder(board, $$.F($.Eng).convoy($$.F($.Lon).move($.Eng))),
        "F Lon is not army"
      )
    })
    it("returns an error message (3)", () => {
      should.equal(
        validator.errorMessageOfOrder(board, $$.F($.Eng).convoy($$.A($.Bur).move($.Mar))),
        "Moving from Bur to Mar via convoy is invalid"
      )
    })
  })
})
