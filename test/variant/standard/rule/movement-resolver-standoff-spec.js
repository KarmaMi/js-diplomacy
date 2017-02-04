'use strict'

const chai = require('chai')

const { Board, Unit } = require('./../../../../lib/board/package')
const { OrderResult: { Executed } } = require('./../../../../lib/rule/package')
const { map, location: $, Power } = require('./../../../../lib/variant/standard/map/package')
const { Turn, Season: { Spring } } = require('./../../../../lib/variant/standard/board/package')
const { Movement, Retreat } = require('./../../../../lib/variant/standard/rule/phase')
const { Army, Fleet } = require('./../../../../lib/variant/standard/rule/military-branch')
const ProvinceStatus = require('./../../../../lib/variant/standard/rule/province-status')
const Result = require('./../../../../lib/variant/standard/rule/result')
const State = require('./../../../../lib/variant/standard/rule/state')
const Helper = require('./../../../../lib/variant/standard/rule/standard-rule-helper')
const MovementResolver = require('./../../../../lib/variant/standard/rule/movement-resolver')

const r = new MovementResolver()

chai.should()

const state1 = new State(new Turn(1901, Spring), Movement)
const state2 = new State(new Turn(1901, Spring), Retreat)

describe('MovementResolver#Standoffs', () => {
  it('DIAGRAM 4', () => {
    const b = new Board(
      map, state1,
      [new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.War, Power.Russia)],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, [$$.A($.Ber).move($.Sil), $$.A($.War).move($.Sil)]
    ).result

    results.should.deep.equal(new Set([
      new Executed($$.A($.Ber).move($.Sil), Result.Bounced),
      new Executed($$.A($.War).move($.Sil), Result.Bounced)
    ]))

    board.should.deep.equal(new Board(
      map, state2,
      [new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.War, Power.Russia)],
      [],
      [[$.Sil.province, new ProvinceStatus(null, true)]]
    ))
  })
  it('DIAGRAM 5', () => {
    const b = new Board(
      map, state1,
      [
        new Unit(Army, $.Kie, Power.Germany), new Unit(Army, $.Ber, Power.Germany),
        new Unit(Army, $.Pru, Power.Russia)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, [$$.A($.Kie).move($.Ber), $$.A($.Ber).move($.Pru), $$.A($.Pru).hold()]
    ).result

    results.should.deep.equal(new Set([
      new Executed($$.A($.Kie).move($.Ber), Result.Bounced),
      new Executed($$.A($.Ber).move($.Pru), Result.Bounced),
      new Executed($$.A($.Pru).hold(), Result.Success)
    ]))
    board.should.deep.equal(new Board(
      map, state2,
      [
        new Unit(Army, $.Kie, Power.Germany), new Unit(Army, $.Ber, Power.Germany),
        new Unit(Army, $.Pru, Power.Russia)
      ],
      [], []
    ))
  })
  it('DIAGRAM 6', () => {
    const b =
      new Board(
        map, state1,
        [new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.Pru, Power.Russia)],
        [], []
      )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, [$$.A($.Ber).move($.Pru), $$.A($.Pru).move($.Ber)]
    ).result

    results.should.deep.equal(new Set([
      new Executed($$.A($.Ber).move($.Pru), Result.Bounced),
      new Executed($$.A($.Pru).move($.Ber), Result.Bounced)
    ]))
    board.should.deep.equal(new Board(
      map, state2,
      [new Unit(Army, $.Ber, Power.Germany), new Unit(Army, $.Pru, Power.Russia)],
      [], []
    ))
  })
  it('DIAGRAM 7', () => {
    const b = new Board(
      map, state1,
      [
        new Unit(Fleet, $.Bel, Power.England), new Unit(Fleet, $.Nth, Power.England),
        new Unit(Army, $.Hol, Power.Germany)
      ],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, [$$.F($.Bel).move($.Nth), $$.F($.Nth).move($.Hol), $$.A($.Hol).move($.Bel)]
    ).result

    results.should.deep.equal(new Set([
      new Executed($$.F($.Bel).move($.Nth), Result.Success),
      new Executed($$.F($.Nth).move($.Hol), Result.Success),
      new Executed($$.A($.Hol).move($.Bel), Result.Success)
    ]))
    board.should.deep.equal(new Board(
      map, state2,
      [
        new Unit(Fleet, $.Nth, Power.England), new Unit(Fleet, $.Hol, Power.England),
        new Unit(Army, $.Bel, Power.Germany)
      ],
      [], []
    ))
  })
})
