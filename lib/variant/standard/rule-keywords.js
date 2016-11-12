const Name = require('../../data/name')
const BaseRuleKeywords = require('../../rule/rule-keywords')
const Order = require('./order')

// Orders
const orders = []
for (const name in Order) {
  orders.push([name.toLowerCase(), Order[name]])
}

class RuleKeywords extends BaseRuleKeywords {
  constructor () {
    super(
      ['Spring', 'Autumn'], ['Movement', 'Retreat', 'Build'],
      [
        'Success', 'Failed', 'Dislodged', 'Bounced', 'Cut', 'Standoff',
        'NoCorrespondingOrder'
      ],
      [new Name('Army', 'A'), new Name('Fleet', 'F')], orders
    )
  }
}

module.exports = new RuleKeywords()
