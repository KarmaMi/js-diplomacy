'use strict'

const chai = require('chai')

const Board = require('./../../../lib/data/board')
const State = require('./../../../lib/data/state')
const Helper = require('./../../../lib/variant/helper')

const ResolverSpecUtil = require('./resolver-spec-util')

const ruleKeywords = require('./../../../lib/variant/standard/rule-keywords')
const rule = require('./../../../lib/variant/standard/rule')
const map = require('./../../../lib/variant/standard/map')
const variant = require('./../../../lib/variant/standard/variant')

const $ = new Helper(ruleKeywords, map)

chai.should()

describe('Rule', () => {
  describe('when there are no dislodged units', () => {
    it('skip retreat phase.', () => {
      const { board, orderResult } = rule.resolve(
        map,
        new Board(
          variant.initialBoard.state,
          [[$.France, [$.A($.Bre)]], [$.Germany, [$.A($.Pic)]]],
          [], [], []
        ),
        [$.A($.Bre).hold(), $.A($.Pic).hold()]
      )

      ResolverSpecUtil.checkOrderResult(
        orderResult,
        [
          [$.A($.Bre).hold(), $.Success],
          [$.A($.Pic).hold(), $.Success]
        ]
      )
      ResolverSpecUtil.checkBoard(
        board,
        new Board(
          new State(1901, $.Autumn, $.Movement),
          [[$.France, [$.A($.Bre)]], [$.Germany, [$.A($.Pic)]]],
          [], [], []
        )
      )
    })
  })
  describe('when all the dislodged units cannot retreat', () => {
    it('skip retreat phase.', () => {
      const { board, orderResult } = rule.resolve(
        map,
        new Board(
          variant.initialBoard.state,
          [[$.France, [$.A($.Bre)]], [$.Germany, [$.A($.Pic), $.A($.Par), $.A($.Gas)]]],
          [], [], []
        ),
        [
          $.A($.Bre).hold(),
          $.A($.Pic).move($.Bre),
          $.A($.Par).support($.A($.Pic).move($.Bre)), $.A($.Gas).support($.A($.Pic).move($.Bre))
        ]
      )

      ResolverSpecUtil.checkOrderResult(
        orderResult,
        [
          [$.A($.Bre).hold(), $.Dislodged],
          [$.A($.Pic).move($.Bre), $.Success],
          [$.A($.Par).support($.A($.Pic).move($.Bre)), $.Success],
          [$.A($.Gas).support($.A($.Pic).move($.Bre)), $.Success],
          [$.A($.Bre).disband(), $.Success]
        ]
      )
      ResolverSpecUtil.checkBoard(
        board,
        new Board(
          new State(1901, $.Autumn, $.Movement),
          [[$.France, []], [$.Germany, [$.A($.Bre), $.A($.Par), $.A($.Gas)]]],
          [], [], []
        )
      )
    })
  })
  describe('when there are no force that can build units', () => {
    it('skip build phase.', () => {
      const { board, orderResult } = rule.resolve(
        map,
        new Board(new State(1901, $.Autumn, $.Retreat), [], [], [], []),
        []
      )

      ResolverSpecUtil.checkOrderResult(
        orderResult,
        []
      )
      ResolverSpecUtil.checkBoard(
        board,
        new Board(new State(1902, $.Spring, $.Movement), [], [], [], [])
      )
    })
  })
  describe('when all build or disband orders are automatically decidable', () => {
    it('skip build phase.', () => {
      const { board, orderResult } = rule.resolve(
        map,
        new Board(new State(1901, $.Autumn, $.Retreat), [[$.Germany, [$.A($.Ruh)]]], [], [], []),
        []
      )

      ResolverSpecUtil.checkOrderResult(orderResult, [[$.A($.Ruh).disband(), $.Success]])
      ResolverSpecUtil.checkBoard(
        board,
        new Board(
          new State(1902, $.Spring, $.Movement), [[$.Germany, []]],
          [[$.Germany, [$.Ruh.province]]], [], []
        )
      )
    })
  })
})
