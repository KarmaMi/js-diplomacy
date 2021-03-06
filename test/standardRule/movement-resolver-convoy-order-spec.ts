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

describe("MovementResolver#Convoy Order", () => {
  it("DIAGRAM 19", () => {
    const b = new Board<Power>(
      map, state1,
      [new Unit(Army, $.Lon, Power.England), new Unit(Fleet, $.Nth, Power.England)],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, new Set([$$.F($.Nth).convoy($$.A($.Lon).move($.Nwy)), $$.A($.Lon).move($.Nwy)])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.F($.Nth).convoy($$.A($.Lon).move($.Nwy)), Result.Success),
      new Executed($$.A($.Lon).move($.Nwy), Result.Success)
    ])
    board.should.deep.equal(
      new Board<Power>(
        map, state2,
        [new Unit(Army, $.Nwy, Power.England), new Unit(Fleet, $.Nth, Power.England)],
        [], []
      )
    )
  })
  it("DIAGRAM 20", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Lon, Power.England), new Unit(Fleet, $.Eng, Power.England),
        new Unit(Fleet, $.Mid, Power.England), new Unit(Fleet, $.Wes, Power.France)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.F($.Eng).convoy($$.A($.Lon).move($.Tun)),
        $$.F($.Mid).convoy($$.A($.Lon).move($.Tun)),
        $$.F($.Wes).convoy($$.A($.Lon).move($.Tun)),
        $$.A($.Lon).move($.Tun)
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.F($.Eng).convoy($$.A($.Lon).move($.Tun)), Result.Success),
      new Executed($$.F($.Mid).convoy($$.A($.Lon).move($.Tun)), Result.Success),
      new Executed($$.F($.Wes).convoy($$.A($.Lon).move($.Tun)), Result.Success),
      new Executed($$.A($.Lon).move($.Tun), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Tun, Power.England), new Unit(Fleet, $.Eng, Power.England),
        new Unit(Fleet, $.Mid, Power.England), new Unit(Fleet, $.Wes, Power.France)
      ],
      [], []
    ))
  })
  it("DIAGRAM 21", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Spa, Power.France), new Unit(Fleet, $.GoL, Power.France),
        new Unit(Fleet, $.Tyn, Power.France), new Unit(Fleet, $.Tun, Power.Italy),
        new Unit(Fleet, $.Ion, Power.Italy)
      ],
      [], []
    )

    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Spa).move($.Nap),
        $$.F($.GoL).convoy($$.A($.Spa).move($.Nap)), $$.F($.Tyn).convoy($$.A($.Spa).move($.Nap)),
        $$.F($.Ion).move($.Tyn), $$.F($.Tun).support($$.F($.Ion).move($.Tyn))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Spa).move($.Nap), Result.Failed),
      new Executed($$.F($.GoL).convoy($$.A($.Spa).move($.Nap)), Result.Failed),
      new Executed($$.F($.Tyn).convoy($$.A($.Spa).move($.Nap)), Result.Dislodged),
      new Executed($$.F($.Ion).move($.Tyn), Result.Success),
      new Executed($$.F($.Tun).support($$.F($.Ion).move($.Tyn)), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Spa, Power.France), new Unit(Fleet, $.GoL, Power.France),
        new Unit(Fleet, $.Tyn, Power.France), new Unit(Fleet, $.Tun, Power.Italy),
        new Unit(Fleet, $.Tyn, Power.Italy)
      ],
      [
        [new Unit(Fleet, $.Tyn, Power.France), new Dislodged($.Ion.province)]
      ],
      []
    ))
  })
})
