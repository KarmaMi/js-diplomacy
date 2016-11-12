const RuleKeywordsHelper = require('../../rule/rule-keywords-helper')
const OrderGenerator = require('./order-generator')
const StandardRuleUtil = require('./standard-rule-util')

const ruleKeywords = require('./rule-keywords')
const $ = RuleKeywordsHelper(ruleKeywords)
const Disband = ruleKeywords.orders.get('disband')

module.exports = class RetreatOrderGenerator extends OrderGenerator {
  getOrdersToSkipPhase (map, board) {
    if (board.unitsStatus.size === 0) {
      return []
    }
    if (
      [...board.unitsStatus].every(elem => {
        return [...elem[1]].every(elem2 => {
          const [unit, status] = elem2
          if (status.status !== $.Dislodged) return false
          const locations = StandardRuleUtil.locationsCanBeRetreated(
            map, board, unit, status.attackedFrom
          )
          return locations.length === 0
        })
      })
    ) {
      // Disband all dislodged units
      return [...board.unitsStatus].map(elem => {
        return [...elem[1]].map(elem2 => new Disband(elem2[0]))
      }).reduce((sum, elem) => sum.concat(elem), [])
    }
    return null
  }
  defaultOrder (map, board, unit) {
    return new Disband(unit)
  }
}
