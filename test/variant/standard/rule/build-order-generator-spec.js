'use strict'

const chai = require('chai')

const { Board, Unit } = require('../../../../lib/board/package')
const { map, location, Power } = require('../../../../lib/variant/standard/map/package')
const { Army } = require('../../../../lib/variant/standard/rule/military-branch')
const { Disband } = require('../../../../lib/variant/standard/rule/order')
const ProvinceStatus = require('../../../../lib/variant/standard/rule/province-status')
const BuildOrderGenerator = require('../../../../lib/variant/standard/rule/build-order-generator')

chai.should()

const $ = location
const generator = new BuildOrderGenerator()

describe('A MovementOrderGenerator', () => {
  describe('when there are no powers that can build or disband units', () => {
    it('uses an empty to skip the build phase.', () => {
      const board = new Board(map, null, [], [], [])
      generator.ordersToSkipPhase(board).should.deep.equal(new Set())
    })
  })
  describe('when all disband orders are automatically decidable', () => {
    it('uses disband order to skip the build phase.', () => {
      const board = new Board(map, null, [new Unit(Army, $.Ruh, Power.Germany)], [], [])
      generator.ordersToSkipPhase(board).should.deep.equal(new Set([
        new Disband(new Unit(Army, $.Ruh, Power.Germany))
      ]))
    })
  })
  describe('otherwise', () => {
    it('does not skip the build phase', () => {
      const board = new Board(
        map, null,
        [new Unit(Army, $.Ruh, Power.Germany)],
        [],
        [
          [$.Mun.province, new ProvinceStatus(Power.Germany, false)],
          [$.Ber.province, new ProvinceStatus(Power.Germany, false)]
        ]
      );
      (generator.ordersToSkipPhase(board) == null).should.deep.equal(true)
    })
  })
})
