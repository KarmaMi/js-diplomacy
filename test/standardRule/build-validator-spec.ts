import * as chai from "chai"
import { BuildValidator } from "./../../src/standardRule/build-validator"
import { standardRule } from "./../../src/standardRule"
import { rule } from "./../../src/rule"
import { standardMap } from "./../../src/standardMap"
import { standardBoard } from "./../../src/standardBoard"

const {
  Order, Error, Board, Unit, MilitaryBranch, State, Result, Phase, ProvinceStatus, StandardRuleHelper: Helper
} = standardRule
const { locations: $, Power, map } = standardMap
const { Season, Turn } = standardBoard
const { Executed } = rule
const { Army, Fleet } = MilitaryBranch
const { Build } = Phase

const should = chai.should()

const validator = new BuildValidator()

describe("A BuildValidator", () => {
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
  describe("when a valid order is received", () => {
    it("returns null (1)", () => {
      should.equal(validator.errorOfOrder(board, $$.A($.Rom).build()), null)
    })
    it("returns null (2)", () => {
      should.equal(validator.errorOfOrder(board, $$.A($.Mun).disband()), null)
    })
  })
  describe("when try to build an unit to a location that has another unit", () => {
    it("returns an error message", () => {
      new Error.UnbuildableLocation($$.A($.Nap).unit).should.deep.equal(
        validator.errorOfOrder(board, $$.A($.Nap).build())
      )
    })
  })
  describe("when try to build an unit to a province that is not home province", () => {
    it("returns an error message", () => {
      new Error.UnbuildableLocation(new Unit(Army, $.Spa, Power.France)).should.deep.equal(
        validator.errorOfOrder(
          board, new Order.Build(new Unit(Army, $.Spa, Power.France))
        )
      )
    })
  })
  describe("when try to build an unit to a province that is not supply center", () => {
    it("returns an error message", () => {
      new Error.UnbuildableLocation($$.A($.Ruh).unit).should.deep.equal(
        validator.errorOfOrder(board, $$.A($.Ruh).build())
      )
    })
  })
  describe("when try to build an unit to a province that is not occupied", () => {
    it("returns an error message", () => {
      new Error.UnbuildableLocation($$.A($.Bre).unit).should.deep.equal(
        validator.errorOfOrder(board, $$.A($.Bre).build())
      )
    })
  })
  describe("when try to disband an unit that does not exist", () => {
    it("returns an error message", () => {
      new Error.UnitNotExisted(new Unit(Army, $.Ber, Power.Germany)).should.deep.equal(
        validator.errorOfOrder(
          board, new Order.Disband(new Unit(Army, $.Ber, Power.Germany))
        )
      )
    })
  })
  describe("when try to an unnecessary disband order", () => {
    it("returns an error message", () => {
      new Error.PowerWithProblem(Power.Italy).should.deep.equal(
        validator.errorOfOrder(board, $$.F($.Nap).disband())
      )
    })
  })
  describe("when valid order set is received", () => {
    it("returns null", () => {
      should.equal(
        validator.errorOfOrders(board, new Set([$$.A($.Mun).disband()])),
        null
      )
    })
  })
  describe("when try to keep units that are more than supply centers", () => {
    it("returns an error message", () => {
      new Error.PowerWithProblem(Power.Germany).should.deep.equal(
        validator.errorOfOrders(board, new Set())
      )
    })
  })
})
