'use strict'

const chai = require('chai')

const { Board, Unit } = require('./../../../../lib/board/package')
const { OrderResult: { Executed } } = require('./../../../../lib/rule/package')
const { map, location: $, Power } = require('./../../../../lib/variant/standard/map/package')
const { Turn, Season: { Spring } } = require('./../../../../lib/variant/standard/board/package')
const { Movement, Retreat } = require('./../../../../lib/variant/standard/rule/phase')
const { Army, Fleet } = require('./../../../../lib/variant/standard/rule/military-branch')
const ProvinceStatus = require('./../../../../lib/variant/standard/rule/province-status')
const Dislodged = require('./../../../../lib/variant/standard/rule/dislodged')
const Result = require('./../../../../lib/variant/standard/rule/result')
const State = require('./../../../../lib/variant/standard/rule/state')
const Helper = require('./../../../../lib/variant/standard/rule/standard-rule-helper')
const MovementResolver = require('./../../../../lib/variant/standard/rule/movement-resolver')

const r = new MovementResolver()

chai.should()

const state1 = new State(new Turn(1901, Spring), Movement)
const state2 = new State(new Turn(1901, Spring), Retreat)

describe('MovementResolver#Convoy Order', () => {
  it('DIAGRAM 19', () => {
    const b = new Board(
      map, state1,
      [new Unit(Army, $.Lon, Power.England), new Unit(Fleet, $.Nth, Power.England)],
      [], []
    )
    const $$ = new Helper(b)
    const { board, results } = r.resolve(
      b, [$$.F($.Nth).convoy($$.A($.Lon).move($.Nwy)), $$.A($.Lon).move($.Nwy)]
    ).result

    results.should.deep.equal(new Set([
      new Executed($$.F($.Nth).convoy($$.A($.Lon).move($.Nwy)), Result.Success),
      new Executed($$.A($.Lon).move($.Nwy), Result.Success)
    ]))
    board.should.deep.equal(
      new Board(
        map, state2,
        [new Unit(Army, $.Nwy, Power.England), new Unit(Fleet, $.Nth, Power.England)],
        [], []
      )
    )
  })
  it('DIAGRAM 20', () => {
    const b = new Board(
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
      [
        $$.F($.Eng).convoy($$.A($.Lon).move($.Tun)),
        $$.F($.Mid).convoy($$.A($.Lon).move($.Tun)),
        $$.F($.Wes).convoy($$.A($.Lon).move($.Tun)),
        $$.A($.Lon).move($.Tun)
      ]
    ).result

    results.should.deep.equal(new Set([
      new Executed($$.F($.Eng).convoy($$.A($.Lon).move($.Tun)), Result.Success),
      new Executed($$.F($.Mid).convoy($$.A($.Lon).move($.Tun)), Result.Success),
      new Executed($$.F($.Wes).convoy($$.A($.Lon).move($.Tun)), Result.Success),
      new Executed($$.A($.Lon).move($.Tun), Result.Success)
    ]))
    board.should.deep.equal(new Board(
      map, state2,
      [
        new Unit(Army, $.Tun, Power.England), new Unit(Fleet, $.Eng, Power.England),
        new Unit(Fleet, $.Mid, Power.England), new Unit(Fleet, $.Wes, Power.France)
      ],
      [], []
    ))
  })
  it('DIAGRAM 21', () => {
    const b = new Board(
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
      [
        $$.A($.Spa).move($.Nap),
        $$.F($.GoL).convoy($$.A($.Spa).move($.Nap)), $$.F($.Tyn).convoy($$.A($.Spa).move($.Nap)),
        $$.F($.Ion).move($.Tyn), $$.F($.Tun).support($$.F($.Ion).move($.Tyn))
      ]
    ).result

    results.should.deep.equal(new Set([
      new Executed($$.A($.Spa).move($.Nap), Result.Failed),
      new Executed($$.F($.GoL).convoy($$.A($.Spa).move($.Nap)), Result.Failed),
      new Executed($$.F($.Tyn).convoy($$.A($.Spa).move($.Nap)), Result.Dislodged),
      new Executed($$.F($.Ion).move($.Tyn), Result.Success),
      new Executed($$.F($.Tun).support($$.F($.Ion).move($.Tyn)), Result.Success)
    ]))
    board.should.deep.equal(new Board(
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
