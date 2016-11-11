const Unit = require('../../data/unit')
const Board = require('../../data/board')
const RuleHelper = require('../../rule/rule-helper')
const StandardRuleUtil = require('./standard-rule-util')

module.exports = class RetreatResolver {
  constructor (rule) {
    this.rule = rule
  }
  resolve (map, board, orders) {
    const $ = new RuleHelper(this.rule)
    const orderResult = new Map()

    const { state, units, occupation } = board

    const nextUnits = new Map()
    units.forEach((units, force) => nextUnits.set(force, [...units]))

    // Resolve all orders
    orders.forEach(order => {
      if (order.type === 'Build') {
        const force = order.unit.location.province.homeOf
        if (!nextUnits.has(force)) nextUnits.set(force, [])
        nextUnits.get(force).push(order.unit)
      } else if (order.type === 'Disband') {
        const force = StandardRuleUtil.getForceOfUnit(board, order.unit)
        if (!nextUnits.has(force)) return
        const us = [...nextUnits.get(force)].filter(unit => {
          return unit.militaryBranch !== order.unit.militaryBranch ||
            unit.location !== order.unit.location
        })
        nextUnits.set(force, us)
      }
      orderResult.set(order, $.Success)
    })

    // Generate new board
    const nextOccupation =
      (state.season === $.Autumn)
        ? StandardRuleUtil.updateOccupation(nextUnits, occupation)
        : occupation

    const nextState = StandardRuleUtil.getNextState(this.rule, state)

    const nextBoard = new Board(nextState, nextUnits, nextOccupation, [], [])

    return { board: nextBoard, orderResult: orderResult }
  }
}
