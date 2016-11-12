'use strict'

const chai = require('chai')

const Helper = require('./../../../lib/variant/helper')
const Board = require('./../../../lib/data/board')
const RetreatOrderGenerator = require('./../../../lib/variant/standard/retreat-order-generator')
const ResolverSpecUtil = require('./resolver-spec-util')

const ruleKeywords = require('./../../../lib/variant/standard/rule-keywords')
const variant = require('./../../../lib/variant/standard/variant')
const { map } = variant

const $ = new Helper(ruleKeywords, map)
const g = new RetreatOrderGenerator()

const board = new Board(
  null,
  [[$.France, [$.A($.Bur)]]],
  [],
  [[$.France, [[$.A($.Mar), { status: $.Dislodged, attackedFrom: $.Gas.province }]]]],
  [[$.Pie.province, $.Standoff]]
)

chai.should()

describe('RetreatOrderGenerator', () => {
  it('uses Disband as a default order.', () => {
    g.defaultOrder(map, board, $.A($.Mar)).type.should.equal('Disband')
  })
  describe('#getOrdersToSkipPhase', () => {
    describe('when there are no dislodged units', () => {
      it('returns [].', () => {
        const orders = g.getOrdersToSkipPhase(
          map,
          new Board(
            variant.initialBoard.state,
            [[$.France, [$.A($.Bre)]], [$.Germany, [$.A($.Pic)]]],
            [], [], []
          )
        )

        orders.should.deep.equal([])
      })
    })
    describe('when all the dislodged units cannot retreat', () => {
      it('returns disband orders.', () => {
        const orders = g.getOrdersToSkipPhase(
          map,
          new Board(
            variant.initialBoard.state,
            [[$.France, []], [$.Germany, [$.A($.Pic), $.A($.Par), $.A($.Gas)]]],
            [],
            [[$.France, [[$.A($.Bre), { status: $.Dislodged, attackedFrom: $.Par.province }]]]],
            []
          )
        )

        ResolverSpecUtil.checkOrders(orders, [$.A($.Bre).disband()])
      })
    })
  })
})
