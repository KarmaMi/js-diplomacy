'use strict'

const chai = require('chai')
const assert = require('assert')

const Board = require('./../../../lib/data/board')
const State = require('./../../../lib/data/state')
const Helper = require('./../../../lib/variant/helper')
const BuildResolver = require('./../../../lib/variant/standard/build-resolver')

const ResolverSpecUtil = require('./resolver-spec-util')

const ruleKeywords = require('./../../../lib/variant/standard/rule-keywords')
const map = require('./../../../lib/variant/standard/map')

const $ = new Helper(ruleKeywords, map)
const r = new BuildResolver()

const b = new Board(
  new State(1901, $.Spring, $.Retreat),
  [[$.Germany, [$.A($.Mun)]], [$.Italy, [$.F($.Nap)]]],
  [[$.Italy, [$.Rom.province, $.Nap.province]], [$.France, [$.Par.province]]],
  [], []
)

chai.should()

describe('BuildResolver', () => {
  it('resolves build order', () => {
    const { board, orderResult } = r.resolve(map, b, [$.A($.Par).build(), $.A($.Mun).disband()])

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Par).build(), $.Success],
        [$.A($.Mun).disband(), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.Germany, []], [$.Italy, [$.F($.Nap)]], [$.France, [$.A($.Par)]]],
        [[$.Italy, [$.Rom.province, $.Nap.province]], [$.France, [$.Par.province]]], [], []
      )
    )
  })
  it('resolves disband order', () => {
    const { board, orderResult } = r.resolve(map, b, [$.A($.Mun).disband()])

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [[$.A($.Mun).disband(), $.Success]]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.Germany, []], [$.Italy, [$.F($.Nap)]]],
        [[$.Italy, [$.Rom.province, $.Nap.province]], [$.France, [$.Par.province]]], [], []
      )
    )
  })
})
