import * as chai from "chai"
import {
  MovementResolver, Board, Unit, MilitaryBranch, State, Dislodged, Result, Phase, ProvinceStatus,
  StandardRuleHelper as Helper
} from "../../../../src/variant/standard/rule/module"
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

describe("MovementResolver#Support Order", () => {
  it("DIAGRAM 8", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Gas, Power.France), new Unit(Army, $.Mar, Power.France),
        new Unit(Army, $.Bur, Power.Germany)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([$$.A($.Mar).move($.Bur), $$.A($.Gas).support($$.A($.Mar).move($.Bur)), $$.A($.Bur).hold()])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Mar).move($.Bur), Result.Success),
      new Executed($$.A($.Gas).support($$.A($.Mar).move($.Bur)), Result.Success),
      new Executed($$.A($.Bur).hold(), Result.Dislodged)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Gas, Power.France), new Unit(Army, $.Bur, Power.France),
        new Unit(Army, $.Bur, Power.Germany)
      ],
      [[new Unit(Army, $.Bur, Power.Germany), new Dislodged($.Mar.province)]],
      []
    ))
  })
  it("DIAGRAM 9", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Fleet, $.Bal, Power.Germany), new Unit(Army, $.Sil, Power.Germany),
        new Unit(Army, $.Pru, Power.Russia)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set(
        [$$.F($.Bal).support($$.A($.Sil).move($.Pru)), $$.A($.Sil).move($.Pru), $$.A($.Pru).hold()]
      )
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.F($.Bal).support($$.A($.Sil).move($.Pru)), Result.Success),
      new Executed($$.A($.Sil).move($.Pru), Result.Success),
      new Executed($$.A($.Pru).hold(), Result.Dislodged)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Fleet, $.Bal, Power.Germany), new Unit(Army, $.Pru, Power.Germany),
        new Unit(Army, $.Pru, Power.Russia)
      ],
      [[new Unit(Army, $.Pru, Power.Russia), new Dislodged($.Sil.province)]],
      []
    ))
  })
  it("DIAGRAM 10", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Fleet, $.GoL, Power.France), new Unit(Fleet, $.Wes, Power.France),
        new Unit(Fleet, $.Rom, Power.Italy), new Unit(Fleet, $.Nap, Power.Italy)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.F($.GoL).move($.Tyn), $$.F($.Wes).support($$.F($.GoL).move($.Tyn)),
        $$.F($.Nap).move($.Tyn), $$.F($.Rom).support($$.F($.Nap).move($.Tyn))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.F($.GoL).move($.Tyn), Result.Bounced),
      new Executed($$.F($.Wes).support($$.F($.GoL).move($.Tyn)), Result.Failed),
      new Executed($$.F($.Nap).move($.Tyn), Result.Bounced),
      new Executed($$.F($.Rom).support($$.F($.Nap).move($.Tyn)), Result.Failed)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Fleet, $.GoL, Power.France), new Unit(Fleet, $.Wes, Power.France),
        new Unit(Fleet, $.Rom, Power.Italy), new Unit(Fleet, $.Nap, Power.Italy)
      ],
      [],
      [[$.Tyn.province, new ProvinceStatus(null, true)]]
    ))
  })
  it("DIAGRAM 11", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Fleet, $.GoL, Power.France), new Unit(Fleet, $.Wes, Power.France),
        new Unit(Fleet, $.Rom, Power.France), new Unit(Fleet, $.Tyn, Power.Italy)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.F($.GoL).move($.Tyn), $$.F($.Wes).support($$.F($.GoL).move($.Tyn)),
        $$.F($.Tyn).hold(), $$.F($.Rom).support($$.F($.Tyn).hold())
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.F($.GoL).move($.Tyn), Result.Bounced),
      new Executed($$.F($.Wes).support($$.F($.GoL).move($.Tyn)), Result.Failed),
      new Executed($$.F($.Tyn).hold(), Result.Success),
      new Executed($$.F($.Rom).support($$.F($.Tyn).hold()), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Fleet, $.GoL, Power.France), new Unit(Fleet, $.Wes, Power.France),
        new Unit(Fleet, $.Rom, Power.France), new Unit(Fleet, $.Tyn, Power.Italy)
      ],
      [], []
    ))
  })
  it("DIAGRAM 12", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Boh, Power.Austria), new Unit(Army, $.Tyr, Power.Austria),
        new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.Mun, Power.Germany),
        new Unit(Army, $.Pru, Power.Russia), new Unit(Army, $.War, Power.Russia)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Boh).move($.Mun), $$.A($.Tyr).support($$.A($.Boh).move($.Mun)),
        $$.A($.Mun).move($.Sil), $$.A($.Ber).support($$.A($.Mun).move($.Sil)),
        $$.A($.War).move($.Sil), $$.A($.Pru).support($$.A($.War).move($.Sil))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Boh).move($.Mun), Result.Success),
      new Executed($$.A($.Tyr).support($$.A($.Boh).move($.Mun)), Result.Success),
      new Executed($$.A($.Mun).move($.Sil), Result.Dislodged),
      new Executed($$.A($.Ber).support($$.A($.Mun).move($.Sil)), Result.Failed),
      new Executed($$.A($.War).move($.Sil), Result.Bounced),
      new Executed($$.A($.Pru).support($$.A($.War).move($.Sil)), Result.Failed)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Mun, Power.Austria), new Unit(Army, $.Tyr, Power.Austria),
        new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.Mun, Power.Germany),
        new Unit(Army, $.Pru, Power.Russia), new Unit(Army, $.War, Power.Russia)
      ],
      [[new Unit(Army, $.Mun, Power.Germany), new Dislodged($.Boh.province)]],
      [[$.Sil.province, new ProvinceStatus(null, true)]]
    ))
  })
  it("DIAGRAM 13", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Ser, Power.Austria), new Unit(Army, $.Rum, Power.Austria),
        new Unit(Army, $.Sev, Power.Austria), new Unit(Army, $.Bul, Power.Turkey)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Bul).move($.Rum),
        $$.A($.Rum).move($.Bul), $$.A($.Sev).move($.Rum), $$.A($.Ser).support($$.A($.Rum).move($.Bul))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Bul).move($.Rum), Result.Dislodged),
      new Executed($$.A($.Rum).move($.Bul), Result.Success),
      new Executed($$.A($.Sev).move($.Rum), Result.Success),
      new Executed($$.A($.Ser).support($$.A($.Rum).move($.Bul)), Result.Success)
    ])

    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Ser, Power.Austria), new Unit(Army, $.Bul, Power.Austria),
        new Unit(Army, $.Rum, Power.Austria), new Unit(Army, $.Bul, Power.Turkey)
      ],
      [[new Unit(Army, $.Bul, Power.Turkey), new Dislodged($.Rum.province)]],
      []
    ))
  })
  it("DIAGRAM 14", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Ser, Power.Austria), new Unit(Army, $.Rum, Power.Austria),
        new Unit(Army, $.Sev, Power.Austria), new Unit(Army, $.Gre, Power.Austria),
        new Unit(Army, $.Bul, Power.Turkey), new Unit(Fleet, $.Bla, Power.Turkey)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Bul).move($.Rum), $$.F($.Bla).support($$.A($.Bul).move($.Rum)),
        $$.A($.Rum).move($.Bul), $$.A($.Sev).move($.Rum),
        $$.A($.Ser).support($$.A($.Rum).move($.Bul)), $$.A($.Gre).support($$.A($.Rum).move($.Bul))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Bul).move($.Rum), Result.Dislodged),
      new Executed($$.F($.Bla).support($$.A($.Bul).move($.Rum)), Result.Failed),
      new Executed($$.A($.Rum).move($.Bul), Result.Success),
      new Executed($$.A($.Sev).move($.Rum), Result.Success),
      new Executed($$.A($.Ser).support($$.A($.Rum).move($.Bul)), Result.Success),
      new Executed($$.A($.Gre).support($$.A($.Rum).move($.Bul)), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Ser, Power.Austria), new Unit(Army, $.Bul, Power.Austria),
        new Unit(Army, $.Rum, Power.Austria), new Unit(Army, $.Gre, Power.Austria),
        new Unit(Army, $.Bul, Power.Turkey), new Unit(Fleet, $.Bla, Power.Turkey)
      ],
      [[new Unit(Army, $.Bul, Power.Turkey), new Dislodged($.Rum.province)]],
      []
    ))
  })
  it("DIAGRAM 15", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Pru, Power.Germany), new Unit(Army, $.Sil, Power.Germany),
        new Unit(Army, $.Boh, Power.Russia), new Unit(Army, $.War, Power.Russia)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Pru).move($.War), $$.A($.Sil).support($$.A($.Pru).move($.War)),
        $$.A($.War).hold(), $$.A($.Boh).move($.Sil)
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Pru).move($.War), Result.Bounced),
      new Executed($$.A($.Sil).support($$.A($.Pru).move($.War)), Result.Cut),
      new Executed($$.A($.War).hold(), Result.Success),
      new Executed($$.A($.Boh).move($.Sil), Result.Bounced)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Pru, Power.Germany), new Unit(Army, $.Sil, Power.Germany),
        new Unit(Army, $.Boh, Power.Russia), new Unit(Army, $.War, Power.Russia)
      ],
      [], []
    ))
  })
  it("DIAGRAM 16", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Pru, Power.Germany), new Unit(Army, $.Sil, Power.Germany),
        new Unit(Army, $.War, Power.Russia)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Pru).move($.War), $$.A($.Sil).support($$.A($.Pru).move($.War)),
        $$.A($.War).move($.Sil)
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Pru).move($.War), Result.Success),
      new Executed($$.A($.Sil).support($$.A($.Pru).move($.War)), Result.Success),
      new Executed($$.A($.War).move($.Sil), Result.Dislodged)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.War, Power.Germany), new Unit(Army, $.Sil, Power.Germany),
        new Unit(Army, $.War, Power.Russia)
      ],
      [[new Unit(Army, $.War, Power.Russia), new Dislodged($.Pru.province)]],
      []
    ))
  })
  it("DIAGRAM 17", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.Sil, Power.Germany),
        new Unit(Fleet, $.Bal, Power.Russia), new Unit(Army, $.Pru, Power.Russia),
        new Unit(Army, $.War, Power.Russia)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Ber).move($.Pru), $$.A($.Sil).support($$.A($.Ber).move($.Pru)),
        $$.F($.Bal).move($.Pru), $$.A($.Pru).move($.Sil), $$.A($.War).support($$.A($.Pru).move($.Sil))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Ber).move($.Pru), Result.Bounced),
      new Executed($$.A($.Sil).support($$.A($.Ber).move($.Pru)), Result.Dislodged),
      new Executed($$.F($.Bal).move($.Pru), Result.Bounced),
      new Executed($$.A($.Pru).move($.Sil), Result.Success),
      new Executed($$.A($.War).support($$.A($.Pru).move($.Sil)), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.Sil, Power.Germany),
        new Unit(Fleet, $.Bal, Power.Russia), new Unit(Army, $.Sil, Power.Russia),
        new Unit(Army, $.War, Power.Russia)
      ],
      [[new Unit(Army, $.Sil, Power.Germany), new Dislodged($.Pru.province)]],
      [[$.Pru.province, new ProvinceStatus(null, true)]]
    ))
  })
  it("DIAGRAM 18", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.Mun, Power.Germany),
        new Unit(Army, $.Pru, Power.Russia), new Unit(Army, $.Sil, Power.Russia),
        new Unit(Army, $.Boh, Power.Russia), new Unit(Army, $.Tyr, Power.Russia)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Ber).hold(), $$.A($.Mun).move($.Sil),
        $$.A($.Pru).move($.Ber), $$.A($.Sil).support($$.A($.Pru).move($.Ber)),
        $$.A($.Boh).move($.Mun), $$.A($.Tyr).support($$.A($.Boh).move($.Mun))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Ber).hold(), Result.Success),
      new Executed($$.A($.Mun).move($.Sil), Result.Dislodged),
      new Executed($$.A($.Pru).move($.Ber), Result.Bounced),
      new Executed($$.A($.Sil).support($$.A($.Pru).move($.Ber)), Result.Cut),
      new Executed($$.A($.Boh).move($.Mun), Result.Success),
      new Executed($$.A($.Tyr).support($$.A($.Boh).move($.Mun)), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.Mun, Power.Germany),
        new Unit(Army, $.Pru, Power.Russia), new Unit(Army, $.Sil, Power.Russia),
        new Unit(Army, $.Mun, Power.Russia), new Unit(Army, $.Tyr, Power.Russia)
      ],
      [[new Unit(Army, $.Mun, Power.Germany), new Dislodged($.Boh.province)]],
      []
    ))
  })
})
