import * as chai from "chai"
import {
  BuildValidator, Board, Unit, MilitaryBranch, State, Result, Phase, ProvinceStatus,
  StandardRuleHelper as Helper
} from "../../../../src/variant/standard/rule/module"
import * as Order from "./../../../../src/variant/standard/rule/order"
import { Executed } from "./../../../../src/rule/module"
import { locations as $, Power, map } from "./../../../../src/variant/standard/map/module"
import { Season, Turn } from "./../../../../src/variant/standard/board/module"

const { Army, Fleet } = MilitaryBranch
const { Build } = Phase

const should = chai.should()

const validator = new BuildValidator((power: Power) => Power[power])

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
      should.equal(validator.errorMessageOfOrder(board, $$.A($.Rom).build()), null)
    })
    it("returns null (2)", () => {
      should.equal(validator.errorMessageOfOrder(board, $$.A($.Mun).disband()), null)
    })
  })
  describe("when try to build an unit to a location that has another unit", () => {
    it("returns an error message", () => {
      should.equal(validator.errorMessageOfOrder(board, $$.A($.Nap).build()), "An unit is in Nap")
    })
  })
  describe("when try to build an unit to a province that is not home province", () => {
    it("returns an error message", () => {
      should.equal(
        validator.errorMessageOfOrder(
          board, new Order.Build(new Unit(Army, $.Spa, Power.France))
        ),
        "France cannot build an unit in Spa"
      )
    })
  })
  describe("when try to build an unit to a province that is not supply center", () => {
    it("returns an error message", () => {
      should.equal(
        validator.errorMessageOfOrder(board, $$.A($.Ruh).build()),
        "Ruh is not supply center"
      )
    })
  })
  describe("when try to build an unit to a province that is not occupied", () => {
    it("returns an error message", () => {
      should.equal(
        validator.errorMessageOfOrder(board, $$.A($.Bre).build()),
        "Bre is not occupied by France"
      )
    })
  })
  describe("when try to disband an unit that does not exist", () => {
    it("returns an error message", () => {
      should.equal(
        validator.errorMessageOfOrder(
          board, new Order.Disband(new Unit(Army, $.Ber, Power.Germany))
        ),
        "A Ber does not exist"
      )
    })
  })
  describe("when try to an unnecessary disband order", () => {
    it("returns an error message", () => {
      should.equal(
        validator.errorMessageOfOrder(board, $$.F($.Nap).disband()),
        "Italy has sufficient supply centers"
      )
    })
  })
  describe("when valid order set is received", () => {
    it("returns null", () => {
      should.equal(
        validator.errorMessageOfOrders(board, new Set([$$.A($.Mun).disband()])),
        null
      )
    })
  })
  describe("when try to keep units that are more than supply centers", () => {
    it("returns an error message", () => {
      should.equal(
        validator.errorMessageOfOrders(board, new Set()),
        "Germany does not have enough supply centers"
      )
    })
  })
})
