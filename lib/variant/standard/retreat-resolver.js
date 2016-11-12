const Unit = require('../../data/unit')
const RuleKeywordsHelper = require('../../rule/rule-keywords-helper')
const StandardRuleUtil = require('./standard-rule-util')

const ruleKeywords = require('./rule-keywords')

module.exports = class RetreatResolver {
  resolve (map, board, orders) {
    const $ = RuleKeywordsHelper(ruleKeywords)

    const orderResult = new Map()

    // Resolve disband orders
    orders.forEach(order => {
      if (order.type !== 'Disband') return

      orderResult.set(order, $.Success)
    })

    // Create a map from province to retreat order
    const provinceToRetreatOrder = new Map()
    orders.forEach(order => {
      if (order.type !== 'Retreat') return

      if (!provinceToRetreatOrder.has(order.destination.province)) {
        provinceToRetreatOrder.set(order.destination.province, [])
      }
      provinceToRetreatOrder.get(order.destination.province).push(order)
    })

    // Resolve retreat orders
    provinceToRetreatOrder.forEach(orders => {
      if (orders.length === 1) {
        orders.forEach(order => orderResult.set(order, $.Success))
      } else {
        orders.forEach(order => orderResult.set(order, $.Failed))
      }
    })

    // Generate new board
    const { units, unitsStatus } = board

    const nextUnits = new Map([...units])

    const provinceToOrderResult = new Map([...orderResult].map(elem => {
      const [order, result] = elem
      return [order.unit.location.province, [order, result]]
    }))
    unitsStatus.forEach((units, force) => {
      if (!nextUnits.has(force)) {
        nextUnits.set(force, [])
      }
      const us = [...nextUnits.get(force)];

      ([...units]).forEach(elem => {
        const unit = elem[0]
        if (provinceToOrderResult.has(unit.location.province)) {
          const [order, result] = provinceToOrderResult.get(unit.location.province)
          if (order.type === 'Retreat' && result === $.Success) {
            us.push(new Unit(unit.militaryBranch, order.destination))
          }
        } else {
          us.push(unit)
        }
      })
      nextUnits.set(force, us)
    })

    return {
      board: StandardRuleUtil.getNewBoard(board, nextUnits, [], []),
      orderResult: orderResult
    }
  }
}
