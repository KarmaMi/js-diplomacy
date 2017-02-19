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

describe("MovementResolver#Rare Cases and Tricky Situations", () => {
  it("DIAGRAM 22", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Par, Power.France), new Unit(Army, $.Bur, Power.France),
        new Unit(Army, $.Mar, Power.France)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Par).move($.Bur),
        $$.A($.Mar).support($$.A($.Par).move($.Bur)),
        $$.A($.Bur).hold()
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Par).move($.Bur), Result.Bounced),
      new Executed($$.A($.Mar).support($$.A($.Par).move($.Bur)), Result.Failed),
      new Executed($$.A($.Bur).hold(), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Par, Power.France), new Unit(Army, $.Bur, Power.France),
        new Unit(Army, $.Mar, Power.France)
      ],
      [], []
    ))
  })
  it("DIAGRAM 23", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Par, Power.France), new Unit(Army, $.Bur, Power.France),
        new Unit(Army, $.Mar, Power.Italy), new Unit(Army, $.Ruh, Power.Germany)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Par).move($.Bur),
        $$.A($.Bur).move($.Mar),
        $$.A($.Mar).move($.Bur),
        $$.A($.Ruh).support($$.A($.Par).move($.Bur))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Par).move($.Bur), Result.Bounced),
      new Executed($$.A($.Bur).move($.Mar), Result.Bounced),
      new Executed($$.A($.Mar).move($.Bur), Result.Bounced),
      new Executed($$.A($.Ruh).support($$.A($.Par).move($.Bur)), Result.Failed)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Par, Power.France), new Unit(Army, $.Bur, Power.France),
        new Unit(Army, $.Mar, Power.Italy), new Unit(Army, $.Ruh, Power.Germany)
      ],
      [], []
    ))
  })
  it("DIAGRAM 24", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Par, Power.France), new Unit(Army, $.Bur, Power.France),
        new Unit(Army, $.Mun, Power.Germany), new Unit(Army, $.Ruh, Power.Germany)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Par).support($$.A($.Ruh).move($.Bur)),
        $$.A($.Bur).hold(),
        $$.A($.Mun).hold(),
        $$.A($.Ruh).move($.Bur)
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Par).support($$.A($.Ruh).move($.Bur)), Result.Failed),
      new Executed($$.A($.Bur).hold(), Result.Success),
      new Executed($$.A($.Mun).hold(), Result.Success),
      new Executed($$.A($.Ruh).move($.Bur), Result.Bounced)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Par, Power.France), new Unit(Army, $.Bur, Power.France),
        new Unit(Army, $.Mun, Power.Germany), new Unit(Army, $.Ruh, Power.Germany)
      ],
      [], []
    ))
  })
  it("DIAGRAM 25", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Boh, Power.Austria), new Unit(Army, $.Tyr, Power.Austria),
        new Unit(Army, $.Ruh, Power.Germany), new Unit(Army, $.Mun, Power.Germany),
        new Unit(Army, $.Sil, Power.Germany)
      ],
      [], []
    )

    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Boh).support($$.A($.Sil).move($.Mun)), $$.A($.Tyr).move($.Mun),
        $$.A($.Mun).move($.Tyr), $$.A($.Sil).move($.Mun), $$.A($.Ruh).move($.Mun)
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Boh).support($$.A($.Sil).move($.Mun)), Result.Failed),
      new Executed($$.A($.Tyr).move($.Mun), Result.Bounced),
      new Executed($$.A($.Mun).move($.Tyr), Result.Bounced),
      new Executed($$.A($.Sil).move($.Mun), Result.Bounced),
      new Executed($$.A($.Ruh).move($.Mun), Result.Bounced)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Boh, Power.Austria), new Unit(Army, $.Tyr, Power.Austria),
        new Unit(Army, $.Ruh, Power.Germany), new Unit(Army, $.Mun, Power.Germany),
        new Unit(Army, $.Sil, Power.Germany)
      ],
      [], []
    ))
  })
  it("DIAGRAM 26", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Fleet, $.Hel, Power.England), new Unit(Fleet, $.Nth, Power.England),
        new Unit(Fleet, $.Den, Power.England), new Unit(Army, $.Ber, Power.Germany),
        new Unit(Fleet, $.Ska, Power.Germany), new Unit(Fleet, $.Bal, Power.Germany)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.F($.Den).move($.Kie), $$.F($.Nth).move($.Den), $$.F($.Hel).support($$.F($.Nth).move($.Den)),
        $$.A($.Ber).move($.Kie), $$.F($.Ska).move($.Den), $$.F($.Bal).support($$.F($.Ska).move($.Den))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.F($.Den).move($.Kie), Result.Bounced),
      new Executed($$.F($.Nth).move($.Den), Result.Bounced),
      new Executed($$.F($.Hel).support($$.F($.Nth).move($.Den)), Result.Failed),
      new Executed($$.A($.Ber).move($.Kie), Result.Bounced),
      new Executed($$.F($.Ska).move($.Den), Result.Bounced),
      new Executed($$.F($.Bal).support($$.F($.Ska).move($.Den)), Result.Failed)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Fleet, $.Hel, Power.England), new Unit(Fleet, $.Nth, Power.England),
        new Unit(Fleet, $.Den, Power.England), new Unit(Army, $.Ber, Power.Germany),
        new Unit(Fleet, $.Ska, Power.Germany), new Unit(Fleet, $.Bal, Power.Germany)
      ],
      [],
      [[$.Kie.province, new ProvinceStatus(null, true)]]
    ))
  })
  it("DIAGRAM 27", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Vie, Power.Austria), new Unit(Army, $.Ser, Power.Austria),
        new Unit(Army, $.Gal, Power.Austria)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Vie).move($.Bud), $$.A($.Ser).move($.Bud),
        $$.A($.Gal).support($$.A($.Ser).move($.Bud))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Vie).move($.Bud), Result.Bounced),
      new Executed($$.A($.Ser).move($.Bud), Result.Success),
      new Executed($$.A($.Gal).support($$.A($.Ser).move($.Bud)), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Vie, Power.Austria), new Unit(Army, $.Bud, Power.Austria),
        new Unit(Army, $.Gal, Power.Austria)
      ],
      [], []
    ))
  })
  it("DIAGRAM 28", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Lon, Power.England), new Unit(Fleet, $.Nth, Power.England),
        new Unit(Army, $.Bel, Power.France), new Unit(Fleet, $.Eng, Power.France)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Lon).move($.Bel), $$.F($.Nth).convoy($$.A($.Lon).move($.Bel)),
        $$.A($.Bel).move($.Lon), $$.F($.Eng).convoy($$.A($.Bel).move($.Lon))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Lon).move($.Bel), Result.Success),
      new Executed($$.F($.Nth).convoy($$.A($.Lon).move($.Bel)), Result.Success),
      new Executed($$.A($.Bel).move($.Lon), Result.Success),
      new Executed($$.F($.Eng).convoy($$.A($.Bel).move($.Lon)), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Bel, Power.England), new Unit(Fleet, $.Nth, Power.England),
        new Unit(Army, $.Lon, Power.France), new Unit(Fleet, $.Eng, Power.France)
      ],
      [], []
    ))
  })
  it("DIAGRAM 29", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Lon, Power.England), new Unit(Fleet, $.Nth, Power.England),
        new Unit(Fleet, $.Eng, Power.England), new Unit(Fleet, $.Bre, Power.France),
        new Unit(Fleet, $.Iri, Power.France)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Lon).move($.Bel),
        $$.F($.Nth).convoy($$.A($.Lon).move($.Bel)), $$.F($.Eng).convoy($$.A($.Lon).move($.Bel)),
        $$.F($.Bre).move($.Eng), $$.F($.Iri).support($$.F($.Bre).move($.Eng))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Lon).move($.Bel), Result.Success),
      new Executed($$.F($.Nth).convoy($$.A($.Lon).move($.Bel)), Result.Success),
      new Executed($$.F($.Eng).convoy($$.A($.Lon).move($.Bel)), Result.Dislodged),
      new Executed($$.F($.Bre).move($.Eng), Result.Success),
      new Executed($$.F($.Iri).support($$.F($.Bre).move($.Eng)), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Bel, Power.England), new Unit(Fleet, $.Nth, Power.England),
        new Unit(Fleet, $.Eng, Power.England), new Unit(Fleet, $.Eng, Power.France),
        new Unit(Fleet, $.Iri, Power.France)
      ],
      [[new Unit(Fleet, $.Eng, Power.England), new Dislodged($.Bre.province)]],
      []
    ))
  })
  it("DIAGRAM 30", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Tun, Power.France), new Unit(Fleet, $.Tyn, Power.France),
        new Unit(Fleet, $.Ion, Power.Italy), new Unit(Fleet, $.Nap, Power.Italy)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Tun).move($.Nap), $$.F($.Tyn).convoy($$.A($.Tun).move($.Nap)),
        $$.F($.Ion).move($.Tyn), $$.F($.Nap).support($$.F($.Ion).move($.Tyn))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Tun).move($.Nap), Result.Failed),
      new Executed($$.F($.Tyn).convoy($$.A($.Tun).move($.Nap)), Result.Dislodged),
      new Executed($$.F($.Ion).move($.Tyn), Result.Success),
      new Executed($$.F($.Nap).support($$.F($.Ion).move($.Tyn)), Result.Success)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Tun, Power.France), new Unit(Fleet, $.Tyn, Power.France),
        new Unit(Fleet, $.Tyn, Power.Italy), new Unit(Fleet, $.Nap, Power.Italy)
      ],
      [[new Unit(Fleet, $.Tyn, Power.France), new Dislodged($.Ion.province)]],
      []
    ))
  })
  it("DIAGRAM 31", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Tun, Power.France), new Unit(Fleet, $.Tyn, Power.France),
        new Unit(Fleet, $.Ion, Power.France), new Unit(Fleet, $.Rom, Power.Italy),
        new Unit(Fleet, $.Nap, Power.Italy)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Tun).move($.Nap),
        $$.F($.Tyn).convoy($$.A($.Tun).move($.Nap)), $$.F($.Ion).convoy($$.A($.Tun).move($.Nap)),
        $$.F($.Rom).move($.Tyn), $$.F($.Nap).support($$.F($.Rom).move($.Tyn))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Tun).move($.Nap), Result.Bounced),
      new Executed($$.F($.Tyn).convoy($$.A($.Tun).move($.Nap)), Result.Failed),
      new Executed($$.F($.Ion).convoy($$.A($.Tun).move($.Nap)), Result.Failed),
      new Executed($$.F($.Rom).move($.Tyn), Result.Bounced),
      new Executed($$.F($.Nap).support($$.F($.Rom).move($.Tyn)), Result.Cut)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Tun, Power.France), new Unit(Fleet, $.Tyn, Power.France),
        new Unit(Fleet, $.Ion, Power.France), new Unit(Fleet, $.Rom, Power.Italy),
        new Unit(Fleet, $.Nap, Power.Italy)
      ],
      [], []
    ))
  })
  it("DIAGRAM 32", () => {
    const b = new Board<Power>(
      map, state1,
      [
        new Unit(Army, $.Tun, Power.France), new Unit(Fleet, $.Tyn, Power.France),
        new Unit(Fleet, $.Ion, Power.France), new Unit(Army, $.Apu, Power.France),
        new Unit(Fleet, $.Rom, Power.Italy), new Unit(Fleet, $.Nap, Power.Italy)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b,
      new Set([
        $$.A($.Tun).move($.Nap), $$.A($.Apu).support($$.A($.Tun).move($.Nap)),
        $$.F($.Tyn).convoy($$.A($.Tun).move($.Nap)), $$.F($.Ion).convoy($$.A($.Tun).move($.Nap)),
        $$.F($.Rom).move($.Tyn), $$.F($.Nap).support($$.F($.Rom).move($.Tyn))
      ])
    ).result

    Array.from(results).should.have.deep.members([
      new Executed($$.A($.Tun).move($.Nap), Result.Success),
      new Executed($$.A($.Apu).support($$.A($.Tun).move($.Nap)), Result.Success),
      new Executed($$.F($.Tyn).convoy($$.A($.Tun).move($.Nap)), Result.Success),
      new Executed($$.F($.Ion).convoy($$.A($.Tun).move($.Nap)), Result.Success),
      new Executed($$.F($.Rom).move($.Tyn), Result.Bounced),
      new Executed($$.F($.Nap).support($$.F($.Rom).move($.Tyn)), Result.Dislodged)
    ])
    board.should.deep.equal(new Board<Power>(
      map, state2,
      [
        new Unit(Army, $.Nap, Power.France), new Unit(Fleet, $.Tyn, Power.France),
        new Unit(Fleet, $.Ion, Power.France), new Unit(Army, $.Apu, Power.France),
        new Unit(Fleet, $.Rom, Power.Italy), new Unit(Fleet, $.Nap, Power.Italy)
      ],
      [[new Unit(Fleet, $.Nap, Power.Italy), new Dislodged($.Tun.province)]],
      []
    ))
  })
})
