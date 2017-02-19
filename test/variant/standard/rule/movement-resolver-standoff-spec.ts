import * as chai from "chai"
import { MovementResolver } from "../../../../src/variant/standard/rule/movement-resolver"
import { StandardRuleHelper as Helper } from "../../../../src/variant/standard/rule/standard-rule-helper"
import { Board, Unit } from "./../../../../src/variant/standard/rule/types"
import { MilitaryBranch } from "./../../../../src/variant/standard/rule/military-branch"
import { State } from "./../../../../src/variant/standard/rule/state"
import { Dislodged } from "./../../../../src/variant/standard/rule/dislodged"
import { Result } from "./../../../../src/variant/standard/rule/result"
import { Phase } from "./../../../../src/variant/standard/rule/phase"
import { ProvinceStatus } from "./../../../../src/variant/standard/rule/province-status"
import { Executed } from "./../../../../src/rule/module"
import { locations as $, Power, map } from "./../../../../src/variant/standard/map/module"
import { Season, Turn } from "./../../../../src/variant/standard/board/module"

const { Army, Fleet } = MilitaryBranch
const { Retreat, Movement } = Phase
const { Spring } = Season

const should = chai.should()

const r = new MovementResolver()

const state1 = new State(new Turn(1901, Spring), Movement)
const state2 = new State(new Turn(1901, Spring), Retreat)

describe("MovementResolver#Standoffs", () => {
  it("DIAGRAM 4", () => {
    const b = new Board<Power>(
      map, state1,
      [new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.War, Power.Russia)],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, new Set([$$.A($.Ber).move($.Sil), $$.A($.War).move($.Sil)])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Ber).move($.Sil), Result.Bounced),
      new Executed($$.A($.War).move($.Sil), Result.Bounced)
    ])

    board.should.deep.equal(new Board<Power>(
      map, state2,
      [new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.War, Power.Russia)],
      [],
      [[$.Sil.province, new ProvinceStatus(null, true)]]
    ))
  })
  it("DIAGRAM 5", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Kie, Power.Germany), new Unit(Army, $.Ber, Power.Germany),
        new Unit(Army, $.Pru, Power.Russia)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, new Set([$$.A($.Kie).move($.Ber), $$.A($.Ber).move($.Pru), $$.A($.Pru).hold()])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Kie).move($.Ber), Result.Bounced),
      new Executed($$.A($.Ber).move($.Pru), Result.Bounced),
      new Executed($$.A($.Pru).hold(), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Kie, Power.Germany), new Unit(Army, $.Ber, Power.Germany),
        new Unit(Army, $.Pru, Power.Russia)
      ],
      [], []
    ))
  })
  it("DIAGRAM 6", () => {
    const b =
      new Board<Power>(
        map, state1,
        [new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.Pru, Power.Russia)],
        [], []
      )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, new Set([$$.A($.Ber).move($.Pru), $$.A($.Pru).move($.Ber)])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Ber).move($.Pru), Result.Bounced),
      new Executed($$.A($.Pru).move($.Ber), Result.Bounced)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.Pru, Power.Russia)],
      [], []
    ))
  })
  it("DIAGRAM 7", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Fleet, $.Bel, Power.England), new Unit(Fleet, $.Nth, Power.England),
        new Unit(Army, $.Hol, Power.Germany)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, new Set([$$.F($.Bel).move($.Nth), $$.F($.Nth).move($.Hol), $$.A($.Hol).move($.Bel)])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.F($.Bel).move($.Nth), Result.Success),
      new Executed($$.F($.Nth).move($.Hol), Result.Success),
      new Executed($$.A($.Hol).move($.Bel), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Fleet, $.Nth, Power.England), new Unit(Fleet, $.Hol, Power.England),
        new Unit(Army, $.Bel, Power.Germany)
      ],
      [], []
    ))
  })
})
