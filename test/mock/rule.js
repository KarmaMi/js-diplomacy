const BaseRule = require('../../lib/rule/rule')

module.exports = class Rule extends BaseRule {
  unitsRequiringOrder (board) { return new Set() }
  errorMessageOfOrder (board, order) { return null }
  errorMessageOfOrders (board, order) { return null }
}
