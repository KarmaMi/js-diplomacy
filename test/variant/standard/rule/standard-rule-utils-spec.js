'use strict'

const chai = require('chai')

const StandardRuleUtils = require('../../../../lib/variant/standard/rule/standard-rule-utils')
const ProvinceStatus = require('../../../../lib/variant/standard/rule/province-status')
const { Board, Unit } = require('./../../../../lib/board/package')
const { Army, Fleet } = require('../../../../lib/variant/standard/rule/military-branch')
const { map, location, Power } = require('../../../../lib/variant/standard/map/package')
const { France, England } = Power

const $ = location

chai.should()

describe('The StandardRuleUtil', () => {
  it('calculates the number of supply centers for each power.', () => {
    const board = new Board(
      map, 'State', [], [],
      [
        [$.Mar.province, new ProvinceStatus(France, false)],
        [$.Spa.province, new ProvinceStatus(France, false)]
      ]
    )
    StandardRuleUtils.numberOfSupplyCenters(board).should.deep.equal(new Map([[France, 2]]))
  })
  it('finds the provinces that an unit can move to', () => {
    const board = new Board(
      map, 'State',
      [
        new Unit(Army, $.Lvp, England), new Unit(Army, $.Edi, England),
        new Unit(Fleet, $.Nrg, England), new Unit(Fleet, $.Bar, England)
      ],
      [], []
    )

    StandardRuleUtils.movableLocationsOf(board, new Unit(Army, $.Lvp, England)).should.deep.equal(
      board.map.movableLocationsOf($.Lvp, Army)
    )
    StandardRuleUtils.movableLocationsOf(board, new Unit(Army, $.Edi, England)).should.deep.equal(
      new Set([...board.map.movableLocationsOf($.Edi, Army)].concat([$.Nwy, $.StP]))
    )
  })
  it('calculte the number of buildable units', () => {
    const board = new Board(
      map, 'State',
      [new Unit(Army, $.Yor, England)],
      [],
      [
        [$.Mar.province, new ProvinceStatus(France, false)],
        [$.Spa.province, new ProvinceStatus(France, false)]
      ]
    )
    const x = StandardRuleUtils.numberOfBuildableUnits(board)
    x.get(France).should.deep.equal(2)
    x.get(England).should.deep.equal(-1)
  })
})
