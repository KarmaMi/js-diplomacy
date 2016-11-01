const Name = require('../../data/name')
const BaseRule = require('../../rule/rule')
const Order = require('./order')

// Orders
const orders = []
for (const name in Order) {
  orders.push([name.toLowerCase(), Order[name]])
}

class Rule extends BaseRule {
  constructor () {
    super(
      ['Spring', 'Autumn'], ['Movement', 'Retreat', 'Build'],
      [new Name('Army', 'A'), new Name('Fleet', 'F')], orders
    )
  }
}

module.exports = new Rule()
