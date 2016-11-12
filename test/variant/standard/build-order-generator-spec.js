'use strict'

const chai = require('chai')

const Helper = require('./../../../lib/variant/helper')
const Board = require('./../../../lib/data/board')
const BuildOrderGenerator = require('./../../../lib/variant/standard/build-order-generator')
const ResolverSpecUtil = require('./resolver-spec-util')

const ruleKeywords = require('./../../../lib/variant/standard/rule-keywords')
const variant = require('./../../../lib/variant/standard/variant')
const { map } = variant

const $ = new Helper(ruleKeywords, map)
const g = new BuildOrderGenerator()

const board = new Board(
  null,
  [[$.Germany, [$.A($.Mun)]], [$.Italy, [$.F($.Nap)]]],
  [[$.Italy, [$.Rom.province, $.Nap.province]], [$.France, [$.Par.province]]],
  [], []
)

chai.should()

describe('RetreatOrderGenerator', () => {
  it('has no default orders.', () => {
    (g.defaultOrder(map, board, $.A($.Mar)) === null).should.equal(true)
  })
  describe('#getOrdersToSkipPhase', () => {
    describe('when there are no force that can build units', () => {
      it('returns [].', () => {
        const orders = g.getOrdersToSkipPhase(
          map,
          new Board(null, [], [], [], [])
        )

        orders.should.deep.equal([])
      })
    })
    describe('when all build or disband orders are automatically decidable', () => {
      it('returns disband orders.', () => {
        const orders = g.getOrdersToSkipPhase(
          map,
          new Board(null, [[$.Germany, [$.A($.Ruh)]]], [], [], [])
        )

        ResolverSpecUtil.checkOrders(orders, [$.A($.Ruh).disband()])
      })
    })
  })
})
