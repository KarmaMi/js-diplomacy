import * as chai from "chai"
import { MovementResolver } from "./../../src/standardRule/movement-resolver"
import { standardRule } from "./../../src/standardRule"
import { rule } from "./../../src/rule"
import { standardMap } from "./../../src/standardMap"
import { standardBoard } from "./../../src/standardBoard"

const {
  Board, Unit, MilitaryBranch, State, Result, Phase, Dislodged, ProvinceStatus, Helper
} = standardRule
declare type Power = standardMap.Power
const { locations: $, Power, map } = standardMap
const { Season, Turn } = standardBoard
const { Executed } = rule
const { Army, Fleet } = MilitaryBranch
const { Retreat, Movement } = Phase
const { Spring } = Season

const should = chai.should()

const r = new MovementResolver()

const state1 = new State(new Turn(1901, Spring), Movement)
const state2 = new State(new Turn(1901, Spring), Retreat)

describe("MovementResolver#Other Cases", () => {
  it("No corresponding order (support)", () => {
    const b = new Board<Power>(
      map, state1,
      [new Unit(Army, $.Par, Power.France), new Unit(Army, $.Mar, Power.France)],
      [], []
    )

    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, new Set([$$.A($.Par).move($.Bur), $$.A($.Mar).support($$.A($.Par).move($.Gas))])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Par).move($.Bur), Result.Success),
      new Executed($$.A($.Mar).support($$.A($.Par).move($.Gas)), Result.NoCorrespondingOrder)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [new Unit(Army, $.Bur, Power.France), new Unit(Army, $.Mar, Power.France)],
      [], []
    ))
  })
  it("No corresponding order (convoy)", () => {
    const b = new Board<Power>(
      map, state1,
      [new Unit(Army, $.Bre, Power.France), new Unit(Fleet, $.Eng, Power.France)],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, new Set([$$.A($.Bre).move($.Par), $$.F($.Eng).convoy($$.A($.Bre).move($.Lon))])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Bre).move($.Par), Result.Success),
      new Executed($$.F($.Eng).convoy($$.A($.Bre).move($.Lon)), Result.NoCorrespondingOrder)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [new Unit(Army, $.Par, Power.France), new Unit(Fleet, $.Eng, Power.France)],
      [], []
    ))
  })
  it("swap locations using convoy (1)", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Pru, Power.Germany), new Unit(Army, $.Ber, Power.Germany),
        new Unit(Fleet, $.Bal, Power.Germany)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Pru).move($.Ber),
        $$.A($.Ber).move($.Pru),
        $$.F($.Bal).convoy($$.A($.Pru).move($.Ber))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Pru).move($.Ber), Result.Success),
      new Executed($$.A($.Ber).move($.Pru), Result.Success),
      new Executed($$.F($.Bal).convoy($$.A($.Pru).move($.Ber)), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.Pru, Power.Germany),
        new Unit(Fleet, $.Bal, Power.Germany)
      ],
      [], []
    ))
  })
  it("swap locations using convoy (2)", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Ber, Power.Germany), new Unit(Fleet, $.Bal, Power.Germany),
        new Unit(Army, $.Pru, Power.Russia), new Unit(Army, $.Sil, Power.Russia)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Pru).move($.Ber), $$.A($.Sil).support($$.A($.Pru).move($.Ber)),
        $$.A($.Ber).move($.Pru), $$.F($.Bal).convoy($$.A($.Pru).move($.Ber))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Pru).move($.Ber), Result.Success),
      new Executed($$.A($.Sil).support($$.A($.Pru).move($.Ber)), Result.Success),
      new Executed($$.A($.Ber).move($.Pru), Result.Success),
      new Executed($$.F($.Bal).convoy($$.A($.Pru).move($.Ber)), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Pru, Power.Germany), new Unit(Fleet, $.Bal, Power.Germany),
        new Unit(Army, $.Ber, Power.Russia), new Unit(Army, $.Sil, Power.Russia)
      ],
      [], []
    ))
  })
  it("two units support each other.", () => {
    const b = new Board<Power>(
      map, state1,
      [new Unit(Fleet, $.Nth, Power.England), new Unit(Fleet, $.Nwy, Power.England)],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.F($.Nth).support($$.F($.Nwy).hold()),
        $$.F($.Nwy).support($$.F($.Nth).hold())
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.F($.Nth).support($$.F($.Nwy).hold()), Result.Success),
      new Executed($$.F($.Nwy).support($$.F($.Nth).hold()), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [new Unit(Fleet, $.Nth, Power.England), new Unit(Fleet, $.Nwy, Power.England)],
      [], []
    ))
  })
  it("self stand-off.", () => {
    const b = new Board<Power>(
      map, state1,
      [new Unit(Army, $.Par, Power.France), new Unit(Army, $.Mar, Power.France)],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, new Set([$$.A($.Par).move($.Bur), $$.A($.Mar).move($.Bur)])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Par).move($.Bur), Result.Bounced),
      new Executed($$.A($.Mar).move($.Bur), Result.Bounced)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [new Unit(Army, $.Par, Power.France), new Unit(Army, $.Mar, Power.France)],
      [],
      [[$.Bur.province, new ProvinceStatus(null, true)]]
    ))
  })
  it("self cutting support.", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Par, Power.France), new Unit(Army, $.Bur, Power.France),
        new Unit(Army, $.Gas, Power.France), new Unit(Army, $.Mar, Power.Italy)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Par).move($.Bur), $$.A($.Bur).support($$.A($.Gas).move($.Mar)), $$.A($.Gas).move($.Mar),
        $$.A($.Mar).hold()
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Par).move($.Bur), Result.Bounced),
      new Executed($$.A($.Bur).support($$.A($.Gas).move($.Mar)), Result.Success),
      new Executed($$.A($.Gas).move($.Mar), Result.Success),
      new Executed($$.A($.Mar).hold(), Result.Dislodged)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Par, Power.France), new Unit(Army, $.Bur, Power.France),
        new Unit(Army, $.Mar, Power.France), new Unit(Army, $.Mar, Power.Italy)
      ],
      [[new Unit(Army, $.Mar, Power.Italy), new Dislodged($.Gas.province)]],
      []
    ))
  })
  it("a complex case conaining convoy and support.", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Tun, Power.Turkey), new Unit(Fleet, $.Tyn, Power.Turkey),
        new Unit(Fleet, $.Rom, Power.France), new Unit(Fleet, $.Wes, Power.France),
        new Unit(Army, $.Ven, Power.Italy), new Unit(Fleet, $.Nap, Power.Italy)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Tun).move($.Nap), $$.F($.Tyn).convoy($$.A($.Tun).move($.Nap)),
        $$.F($.Rom).support($$.F($.Wes).move($.Tyn)), $$.F($.Wes).move($.Tyn),
        $$.A($.Ven).move($.Rom), $$.F($.Nap).support($$.A($.Ven).move($.Rom))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Tun).move($.Nap), Result.Bounced),
      new Executed($$.F($.Tyn).convoy($$.A($.Tun).move($.Nap)), Result.Failed),
      new Executed($$.F($.Rom).support($$.F($.Wes).move($.Tyn)), Result.Cut),
      new Executed($$.F($.Wes).move($.Tyn), Result.Bounced),
      new Executed($$.A($.Ven).move($.Rom), Result.Bounced),
      new Executed($$.F($.Nap).support($$.A($.Ven).move($.Rom)), Result.Cut)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Tun, Power.Turkey), new Unit(Fleet, $.Tyn, Power.Turkey),
        new Unit(Fleet, $.Rom, Power.France), new Unit(Fleet, $.Wes, Power.France),
        new Unit(Army, $.Ven, Power.Italy), new Unit(Fleet, $.Nap, Power.Italy)
      ],
      [], []
    ))
  })
  it("handles the issue #53.", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Vie, Power.Austria), new Unit(Army, $.Bud, Power.Austria),
        new Unit(Fleet, $.Tri, Power.Austria)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Vie).move($.Tri), $$.A($.Bud).support($$.A($.Vie).move($.Tri)),
        $$.F($.Tri).move($.Adr)
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Vie).move($.Tri), Result.Success),
      new Executed($$.A($.Bud).support($$.A($.Vie).move($.Tri)), Result.Success),
      new Executed($$.F($.Tri).move($.Adr), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Tri, Power.Austria), new Unit(Army, $.Bud, Power.Austria),
        new Unit(Fleet, $.Adr, Power.Austria)
      ],
      [], []
    ))
  })
})
