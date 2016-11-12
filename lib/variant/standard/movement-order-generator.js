const OrderGenerator = require('./order-generator')

const ruleKeywords = require('./rule-keywords')

module.exports = class MovementOrderGenerator extends OrderGenerator {
  defaultOrder (map, board, unit) {
    const Hold = ruleKeywords.orders.get('hold')
    return new Hold(unit)
  }
}
