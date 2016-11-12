const Validator = require('./validator')
const RuleKeywordsHelper = require('../../rule/rule-keywords-helper')
const StandardRuleUtil = require('./standard-rule-util')

const ruleKeywords = require('./rule-keywords')

module.exports = class RetreatResolver extends Validator {
  getErrorMessageForOrder (map, board, order) {
    const $ = RuleKeywordsHelper(ruleKeywords)

    // The order is invalid if order.unit is not dislodged
    let dislodged = null
    board.unitsStatus.forEach(units => {
      [...units].forEach(elem => {
        const [unit, status] = elem
        if (
          unit.militaryBranch === order.unit.militaryBranch &&
          unit.location === order.unit.location && status.status === $.Dislodged
        ) {
          dislodged = status
        }
      })
    })
    if (!dislodged) return `${order.unit} is not dislodged.`

    switch (order.type) {
      case 'Retreat':
        if (!new Set([...map.canMoveTo(order.unit)]).has(order.destination)) {
          return `${order.unit} cannot move to ${order.destination}.`
        }
        if (StandardRuleUtil.existsUnitInProvince(board, order.destination.province)) {
          return `An unit is in ${order.destination.province.name}.`
        }
        if (dislodged.attackedFrom === order.destination.province) {
          return `${order.unit} was dislodged by the attack from ${dislodged.attackedFrom}.`
        }
        if (board.provincesStatus.get(order.destination.province) === $.Standoff) {
          return `${order.destination.province.name} was stand-off.`
        }

        return null
      case 'Disband': return null
    }

    throw 'This method is not implemented yet.'
  }

  defaultOrder (map, board, unit) {
    const Disband = ruleKeywords.orders.get('disband')
    return new Disband(unit)
  }
}
