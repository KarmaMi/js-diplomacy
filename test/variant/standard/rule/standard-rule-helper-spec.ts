import * as chai from "chai"
import {
  StandardRuleHelper, Board, Unit, MilitaryBranch, State, Phase, Dislodged, ProvinceStatus
} from "../../../../src/variant/standard/rule/module"
import * as Order from "./../../../../src/variant/standard/rule/order"
import { locations as $, Power, map } from "./../../../../src/variant/standard/map/module"

const { Army, Fleet } = MilitaryBranch
const { France } = Power

const should = chai.should()

const turn = {
  isBuildable: true,
  isOccupationUpdateable: true,
  nextTurn: () => this
}
const movement = new State(turn, Phase.Movement)
const retreat = new State(turn, Phase.Retreat)
const build = new State(turn, Phase.Build)

describe("A StandardRuleHelper", () => {
  describe("when the phase is movement", () => {
    const board = new Board(
      map, movement,
      [
        new Unit(Army, $.Spa, France),
        new Unit(Fleet, $.GoL, France)
      ],
      [], []
    )
    const $$ = new StandardRuleHelper(board)
    it("generates an unit, ", () => {
      $$.A($.Spa).unit.should.deep.equal(new Unit(Army, $.Spa, France))
      $$.U($.Spa).unit.should.deep.equal(new Unit(Army, $.Spa, France))
    })
    it("generates Hold orders", () => {
      $$.A($.Spa).hold().should.deep.equal(new Order.Hold($$.A($.Spa).unit))
    })
    it("generates Move orders (1)", () => {
      $$.A($.Spa).move($.Mar).should.deep.equal(new Order.Move($$.A($.Spa).unit, $.Mar, false))
    })
    it("generates Move orders (2)", () => {
      $$.A($.Spa).moveViaConvoy($.Mar).should.deep.equal(
        new Order.Move($$.A($.Spa).unit, $.Mar, true)
      )
    })
    it("generates Support orders", () => {
      $$.A($.Spa).support($$.F($.GoL).move($.Mar)).should.deep.equal(
        new Order.Support($$.A($.Spa).unit, $$.F($.GoL).move($.Mar))
      )
    })
    it("generates Convoy orders", () => {
      $$.F($.GoL).convoy($$.A($.Spa).move($.Mar)).should.deep.equal(
        new Order.Convoy($$.F($.GoL).unit, $$.A($.Spa).move($.Mar))
      )
    })
  })
  describe("when the phase is retreat", () => {
    const unit = new Unit(Fleet, $.Spa_SC, France)
    const board = new Board(
      map, retreat,
      [
        new Unit(Army, $.Spa, France),
        unit
      ],
      [
        [unit, new Dislodged($.Mar.province)]
      ],
      []
    )
    const $$ = new StandardRuleHelper(board)
    it("generates an unit, ", () => {
      $$.F($.Spa_SC).unit.should.deep.equal(new Unit(Fleet, $.Spa_SC, France))
      $$.U($.Spa_SC).unit.should.deep.equal(new Unit(Fleet, $.Spa_SC, France))
    })
    it("generates Retreat orders", () => {
      $$.F($.Spa_SC).retreat($.Mar).should.deep.equal(
        new Order.Retreat($$.F($.Spa_SC).unit, $.Mar)
      )
    })
    it("generates Disband orders", () => {
      $$.F($.Spa_SC).disband().should.deep.equal(new Order.Disband($$.F($.Spa_SC).unit))
    })
  })
  describe("when the phase is build", () => {
    const board = new Board(
      map, build,
      [
        new Unit(Army, $.Spa, France),
        new Unit(Fleet, $.Spa_SC, France)
      ],
      [], []
    )
    const $$ = new StandardRuleHelper(board)
    it("generates an unit, ", () => {
      $$.F($.Spa_SC).unit.should.deep.equal(new Unit(Fleet, $.Spa_SC, France))
      $$.U($.Spa_SC).unit.should.deep.equal(new Unit(Fleet, $.Spa_SC, France))
    })
    it("generates Build orders", () => {
      $$.A($.Par).build().should.deep.equal(
        new Order.Build($$.A($.Par).unit)
      )
    })
    it("generates Disband orders", () => {
      $$.F($.Spa_SC).disband().should.deep.equal(new Order.Disband($$.F($.Spa_SC).unit))
    })
  })
})
