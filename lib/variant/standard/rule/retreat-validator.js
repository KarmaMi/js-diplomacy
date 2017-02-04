const StandardRuleUtils = require('./standard-rule-utils')

module.exports = class RetreatValidator {
  unitsRequiringOrder (board) {
    return new Set([...board.unitStatuses].map(elem => elem[0]))
  }
  errorMessageOfOrder (board, order) {
    // The order is invalid if order.unit is not dislodged
    const dislodged = [...board.unitStatuses].some(elem => {
      const unit = elem[0]
      return (unit.militaryBranch === order.unit.militaryBranch) &&
        (unit.location === order.unit.location) &&
        (unit.power === order.unit.power)
    })

    if (!dislodged) {
      return `${order.unit} is not dislodged`
    }

    const status = [...board.unitStatuses].find(elem => {
      const unit = elem[0]
      return (unit.militaryBranch === order.unit.militaryBranch) &&
        (unit.location === order.unit.location) &&
        (unit.power === order.unit.power)
    })[1]

    switch (order.tpe) {
      case 'Retreat':
        const ls = StandardRuleUtils.locationsToRetreat(board, order.unit, status.attackedFrom)
        if (!ls.has(order.destination)) {
          return `${order.unit} cannot retreat to ${order.destination}`
        }
        break
      case 'Disband':
        break
      default:
        return `${order} is for Retreat phase`
    }
    return null
  }

  errorMessageOfOrders (board, orders) {
    for (let elem of [...board.unitStatuses]) {
      const [unit, status] = elem
      const hasOrder = [...orders].some(order => {
        return (unit.militaryBranch === order.unit.militaryBranch) &&
          (unit.location === order.unit.location) &&
          (unit.power === order.unit.power)
      })

      if (!hasOrder) {
        return `${unit} has no order`
      }
    }
  }
}
