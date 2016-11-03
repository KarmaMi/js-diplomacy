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
      ['Success', 'Fail', 'Dislodged', 'Cut', 'Standoff', 'NoCorrespoindgOrder'],
      [new Name('Army', 'A'), new Name('Fleet', 'F')], orders
    )
  }

  _resolveOrder (map, board, orders) {
    return null
  }

  getErrorMessageForOrder (map, board, order) {
    return null
  }

  defaultOrder (map, board, unit) {
    return null
  }
}

module.exports = new Rule()
