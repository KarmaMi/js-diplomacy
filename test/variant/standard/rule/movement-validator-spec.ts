import * as chai from "chai"
import {
  MovementValidator, Board, Unit, MilitaryBranch, State, Result, Phase, ProvinceStatus,
  StandardRuleHelper as Helper
} from "../../../../src/variant/standard/rule/module"
import * as Order from "./../../../../src/variant/standard/rule/order"
import * as Error from "./../../../../src/variant/standard/rule/error"
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
      should.equal(validator.errorOfOrder(board, $$.A($.Lvp).move($.Yor)), null)
    })
    it("returns null (2)", () => {
      should.equal(validator.errorOfOrder(board, $$.A($.Spa).move($.Wal)), null)
    })
  })
  describe("an order that its target unit does not exist is received", () => {
    it("returns an error message", () => {
      new Error.UnitNotExisted(new Unit(Army, $.Lon, Power.England)).should.deep.equal(
        validator.errorOfOrder(board, new Order.Hold(new Unit(Army, $.Lon, Power.England)))
      )
    })
  })
  describe("a unit tries to move an invalid location", () => {
    it("returns an error message", () => {
      new Error.UnmovableLocation($$.A($.Lvp).unit, $.Bud).should.deep.equal(
        validator.errorOfOrder(board, $$.A($.Lvp).move($.Bud))
      )
    })
  })
  describe("a unit tries to support an invalid location", () => {
    it("returns an error message (1)", () => {
      new Error.UnsupportableLocation($$.A($.Lvp).unit, $.Spa).should.deep.equal(
        validator.errorOfOrder(board, $$.A($.Lvp).support($$.A($.Spa).hold()))
      )
    })
    it("returns an error message (2)", () => {
      new Error.UnmovableLocation($$.A($.Spa).unit, $.Bud).should.deep.equal(
        validator.errorOfOrder(board, $$.A($.Lvp).support($$.A($.Spa).move($.Bud)))
      )
    })
  })
  describe("a unit tries to convoy an invalid order", () => {
    it("returns an error message (1)", () => {
      new Error.CannotBeOrdered($$.A($.Lvp).convoy($$.F($.Lon).move($.Yor))).should.deep.equal(
        validator.errorOfOrder(board, $$.A($.Lvp).convoy($$.F($.Lon).move($.Yor)))
      )
    })
    it("returns an error message (2)", () => {
      new Error.CannotBeOrdered($$.F($.Eng).convoy($$.F($.Lon).move($.Eng))).should.deep.equal(
        validator.errorOfOrder(board, $$.F($.Eng).convoy($$.F($.Lon).move($.Eng)))
      )
    })
    it("returns an error message (3)", () => {
      new Error.UnmovableLocation($$.A($.Bur).unit, $.Mar).should.deep.equal(
        validator.errorOfOrder(board, $$.F($.Eng).convoy($$.A($.Bur).move($.Mar)))
      )
    })
  })
})
