const Name = require('../../data/name')
const BaseRule = require('../../rule/rule')
const RuleHelper = require('../../rule/rule-helper')
const Order = require('./order')
const MovementResolver = require('./movement-resolver')
const MovementValidator = require('./movement-validator')
const RetreatResolver = require('./retreat-resolver')
const RetreatValidator = require('./retreat-validator')

// Orders
const orders = []
for (const name in Order) {
  orders.push([name.toLowerCase(), Order[name]])
}

class Rule extends BaseRule {
  constructor () {
    super(
      ['Spring', 'Autumn'], ['Movement', 'Retreat', 'Build'],
      [
        'Success', 'Failed', 'Dislodged', 'Bounced', 'Cut', 'Standoff',
        'NoCorrespondingOrder'
      ],
      [new Name('Army', 'A'), new Name('Fleet', 'F')], orders
    )

    this.movementResolver = new MovementResolver(this)
    this.movementValidator = new MovementValidator(this)
    this.retreatResolver = new RetreatResolver(this)
    this.retreatValidator = new RetreatValidator(this)
    this.helper = new RuleHelper(this)
  }

  _resolveOrder (map, board, orders) {
    const $ = this.helper
    switch (board.state.phase) {
      case $.Movement: return this.movementResolver.resolve(map, board, orders)
      case $.Retreat: return this.retreatResolver.resolve(map, board, orders)
      case $.Build:
        break
    }
    return null
  }

  getErrorMessageForOrder (map, board, order) {
    const $ = this.helper
    switch (board.state.phase) {
      case $.Movement: return this.movementValidator.getErrorMessageForOrder(map, board, order)
      case $.Retreat: return this.retreatValidator.getErrorMessageForOrder(map, board, order)
      case $.Build:
        break
    }
    return null
  }

  getErrorMessageForOrders (map, board, orders) {
    const $ = this.helper
    switch (board.state.phase) {
      case $.Movement: return this.movementValidator.getErrorMessageForOrders(map, board, orders)
      case $.Retreat: return this.retreatValidator.getErrorMessageForOrders(map, board, orders)
      case $.Build:
        break
    }
    return null
  }

  defaultOrder (map, board, unit) {
    const $ = this.helper
    switch (board.state.phase) {
      case $.Movement: return this.movementValidator.defaultOrder(map, board, unit)
      case $.Retreat: return this.retreatValidator.defaultOrder(map, board, unit)
      case $.Build:
        break
    }
    return null
  }
}

module.exports = new Rule()
