const StandardRuleUtils = require('./standard-rule-utils')
const { Disband } = require('./order')

module.exports = class RetreatOrderGenerator {
  ordersToSkipPhase (board) {
    if (board.unitStatuses.size === 0) {
      return new Set()
    }
    if (
      [...board.unitStatuses].every(elem => {
        const [unit, status] = elem
        const locations = StandardRuleUtils.locationsToRetreat(board, unit, status.attackedFrom)
        return locations.size === 0
      })
    ) {
      // Disband all dislodged units
      const retval = new Set()
      board.unitStatuses.forEach((status, unit) => {
        retval.add(new Disband(unit))
      })
      return retval
    }
    return null
  }
  defaultOrderOf (board, unit) {
    return new Disband(unit)
  }
}
