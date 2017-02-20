import * as chai from "chai"
import {
  Rule, Board, Unit, MilitaryBranch, State, Result, Phase, ProvinceStatus, Dislodged,
  Disband, StandardRuleHelper as Helper
} from "../../../../src/variant/standard/rule/module"
import { Executed } from "./../../../../src/rule/module"
import { locations as $, Power, map } from "./../../../../src/variant/standard/map/module"
import { Season, Turn } from "./../../../../src/variant/standard/board/module"

const { Army, Fleet } = MilitaryBranch
const { Retreat, Movement } = Phase
const { Spring, Autumn } = Season

const should = chai.should()

const rule = new Rule((x: Power) => Phase[x])

const state1 = new State(new Turn(1901, Spring), Movement)
const state3 = new State(new Turn(1901, Autumn), Movement)
const state4 = new State(new Turn(1901, Autumn), Retreat)
const state5 = new State(new Turn(1902, Spring), Movement)

describe("A rule", () => {
  describe("when there are no dislodged units", () => {
    it("skips retreat phase.", () => {
      const b = new Board<Power>(
        map, state1,
        [new Unit(Army, $.Bre, Power.France), new Unit(Army, $.Pic, Power.Germany)],
        [], []
      )
      const $$ = new Helper(b)
      const r = rule.resolve(b, new Set()).result
      should.not.equal(r, null)
      if (r) {
        const { board, results } = r

        Array.from(results).should.have.deep.members([
          new Executed($$.A($.Bre).hold(), Result.Success),
          new Executed($$.A($.Pic).hold(), Result.Success)
        ])
        board.should.deep.equal(new Board<Power>(
          map, state3,
          [new Unit(Army, $.Bre, Power.France), new Unit(Army, $.Pic, Power.Germany)],
          [], []
        ))
      }
    })
  })
  describe("when all dislodged units cannot retreat", () => {
    it("skips retreat phase", () => {
      const b = new Board<Power>(
        map, state1,
        [
          new Unit(Army, $.Bre, Power.France), new Unit(Army, $.Gas, Power.Germany),
          new Unit(Army, $.Par, Power.Germany), new Unit(Army, $.Pic, Power.Germany)
        ],
        [], []
      )
      const $$ = new Helper(b)
      const r = rule.resolve(
        b,
        new Set([
          $$.A($.Bre).hold(), $$.A($.Pic).move($.Bre),
          $$.A($.Par).support($$.A($.Pic).move($.Bre)), $$.A($.Gas).support($$.A($.Pic).move($.Bre))
        ])
      ).result
      should.not.equal(r, null)
      if (r) {
        const { board, results } = r

        Array.from(results).should.have.deep.members([
          new Executed($$.A($.Bre).hold(), Result.Dislodged),
          new Executed($$.A($.Pic).move($.Bre), Result.Success),
          new Executed($$.A($.Par).support($$.A($.Pic).move($.Bre)), Result.Success),
          new Executed($$.A($.Gas).support($$.A($.Pic).move($.Bre)), Result.Success),
          new Executed($$.A($.Bre).disband(), Result.Success)
        ])
        board.should.deep.equal(new Board<Power>(
          map, state3,
          [
            new Unit(Army, $.Gas, Power.Germany),
            new Unit(Army, $.Par, Power.Germany), new Unit(Army, $.Bre, Power.Germany)
          ],
          [], []
        ))
      }
    })
  })
  describe("when there are no force that can build units", () => {
    it("skips build phase.", () => {
      const b = new Board<Power>(
        map, state4,
        [
          new Unit(Army, $.Bre, Power.France), new Unit(Army, $.Mun, Power.Germany)
        ],
        [],
        [
          [$.Bre.province, new ProvinceStatus(Power.France, false)],
          [$.Mun.province, new ProvinceStatus(Power.Germany, false)]
        ]
      )
      const r = rule.resolve(b, new Set()).result
      should.not.equal(r, null)
      if (r) {
        const { board, results } = r

        results.should.deep.equal(new Set())
        board.should.deep.equal(new Board<Power>(
          map, state5,
          [
            new Unit(Army, $.Bre, Power.France), new Unit(Army, $.Mun, Power.Germany)
          ],
          [],
          [
            [$.Bre.province, new ProvinceStatus(Power.France, false)],
            [$.Mun.province, new ProvinceStatus(Power.Germany, false)]
          ]
        ))
      }
    })
  })
  describe("when all build or disband orders are automatically decidable", () => {
    it("skip build phase.", () => {
      const b = new Board<Power>(
        map, state3,
        [
          new Unit(Army, $.Gas, Power.France), new Unit(Army, $.Mun, Power.Germany)
        ],
        [],
        [
          [$.Gas.province, new ProvinceStatus(Power.France, false)],
          [$.Mun.province, new ProvinceStatus(Power.Germany, false)]
        ]
      )
      const $$ = new Helper(b)
      const r = rule.resolve(b, new Set()).result
      should.not.equal(r, null)

      if (r) {
        const { board, results } = r

        Array.from(results).should.have.deep.members([
          new Executed($$.A($.Gas).hold(), Result.Success),
          new Executed($$.A($.Mun).hold(), Result.Success),
          new Executed(new Disband(new Unit(Army, $.Gas, Power.France)), Result.Success)
        ])
        board.should.deep.equal(new Board<Power>(
          map, state5,
          [new Unit(Army, $.Mun, Power.Germany)],
          [],
          [
            [$.Gas.province, new ProvinceStatus(Power.France, false)],
            [$.Mun.province, new ProvinceStatus(Power.Germany, false)]
          ]
        ))
      }
    })
  })
  describe("when a power controls half of supply centers", () => {
    it("finishes the game", () => {
      const b = new Board<Power>(
        map, state3,
        [],
        [],
        [
          [$.StP.province, new ProvinceStatus(Power.France, false)],
          [$.Swe.province, new ProvinceStatus(Power.France, false)],
          [$.Nwy.province, new ProvinceStatus(Power.France, false)],
          [$.Den.province, new ProvinceStatus(Power.France, false)],
          [$.Lvp.province, new ProvinceStatus(Power.France, false)],
          [$.Edi.province, new ProvinceStatus(Power.France, false)],
          [$.Lon.province, new ProvinceStatus(Power.France, false)],
          [$.Ber.province, new ProvinceStatus(Power.France, false)],
          [$.Kie.province, new ProvinceStatus(Power.France, false)],
          [$.Mun.province, new ProvinceStatus(Power.France, false)],
          [$.Hol.province, new ProvinceStatus(Power.France, false)],
          [$.Bel.province, new ProvinceStatus(Power.France, false)],
          [$.Bre.province, new ProvinceStatus(Power.France, false)],
          [$.Par.province, new ProvinceStatus(Power.France, false)],
          [$.Mar.province, new ProvinceStatus(Power.France, false)],
          [$.Spa.province, new ProvinceStatus(Power.France, false)],
          [$.Por.province, new ProvinceStatus(Power.France, false)],
          [$.Tun.province, new ProvinceStatus(Power.France, false)]
        ]
      )
      const r = rule.resolve(b, new Set()).result
      should.not.equal(r, null)
      if (r) {
        r.isFinished.should.equal(true)
      }
    })
  })
})
