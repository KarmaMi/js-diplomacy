'use strict'

const chai = require('chai')

const Helper = require('./../../../lib/variant/helper')
const MovementOrderGenerator = require('./../../../lib/variant/standard/movement-order-generator')

const ruleKeywords = require('./../../../lib/variant/standard/rule-keywords')
const variant = require('./../../../lib/variant/standard/variant')
const { map } = variant

const $ = new Helper(ruleKeywords, map)
const g = new MovementOrderGenerator()

chai.should()

describe('MovementOrderGenerator', () => {
  it('uses Hold as a default order.', () => {
    g.defaultOrder(map, variant.initialBoard, $.A($.Lon)).type.should.equal('Hold')
    g.defaultOrder(map, variant.initialBoard, $.F($.Lon)).type.should.equal('Hold')
  })
})
