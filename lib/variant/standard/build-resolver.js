const ruleKeywords = require('./rule-keywords')
const RuleKeywordsHelper = require('../../rule/rule-keywords-helper')
const StandardRuleUtil = require('./standard-rule-util')

module.exports = class RetreatResolver {
  resolve (map, board, orders) {
    const $ = RuleKeywordsHelper(ruleKeywords)
    const orderResult = new Map()

    const nextUnits = new Map()
    board.units.forEach((units, force) => nextUnits.set(force, [...units]))

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

    return {
      board: StandardRuleUtil.getNewBoard(board, nextUnits, [], []),
      orderResult: orderResult
    }
  }
}
