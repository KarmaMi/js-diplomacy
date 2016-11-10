const Validator = require('./validator')
const RuleHelper = require('../../rule/rule-helper')
const StandardRuleUtil = require('./standard-rule-util')

module.exports = class RetreatResolver extends Validator {
  constructor (rule) {
    super()

    this.rule = rule
  }

  getErrorMessageForOrder (map, board, order) {
    const $ = new RuleHelper(this.rule)

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

    let targetMsg = null
    switch (order.type) {
      case 'Retreat':
        if (!new Set([...map.canMoveTo(order.unit)]).has(order.destination)) {
          return `${order.unit} cannot move to ${order.destination}.`
        }
        if (
          [...board.units].some(elem => {
            return elem[1].some(unit => unit.location.province === order.destination.province)
          })
        ) {
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
    const Disband = this.rule.orders.get('disband')
    return new Disband(unit)
  }
}
