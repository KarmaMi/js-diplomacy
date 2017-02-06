'use strict'

const chai = require('chai')

const StandardRuleUtils = require('../../../../lib/variant/standard/rule/standard-rule-utils')
const ProvinceStatus = require('../../../../lib/variant/standard/rule/province-status')
const { Board } = require('./../../../../lib/board/package')
const { map, location, Power } = require('../../../../lib/variant/standard/map/package')
const { France } = Power

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
})
