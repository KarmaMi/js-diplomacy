const Name = require('../../data/name')
const BaseRule = require('../../rule/rule')
const RuleHelper = require('../../rule/rule-helper')
const Order = require('./order')
const MovementResolver = require('./movement-resolver')
const MovementValidator = require('./movement-validator')

// Orders
const orders = []
for (const name in Order) {
  orders.push([name.toLowerCase(), Order[name]])
}

class Rule extends BaseRule {
  constructor () {
    super(
      ['Spring', 'Autumn'], ['Movement', 'Retreat', 'Build'],
      ['Success', 'Fail', 'Hold', 'Dislodged', 'Cut', 'Standoff', 'NoCorrespoindgOrder'],
      [new Name('Army', 'A'), new Name('Fleet', 'F')], orders
    )

    this.movementResolver = new MovementResolver(this)
    this.movementValidator = new MovementValidator(this)
    this.helper = new RuleHelper(this)
  }

  _resolveOrder (map, board, orders) {
    const $ = this.helper
    switch (board.state.phase) {
      case $.Movement: return this.movementResolver.resolve(map, board, orders)
      case $.Retreat:
        break
      case $.Build:
        break
    }
    return null
  }

  getErrorMessageForOrder (map, board, order) {
    const $ = this.helper
    switch (board.state.phase) {
      case $.Movement: return this.movementValidator.getErrorMessageForOrder(map, board, order)
      case $.Retreat:
        break
      case $.Build:
        break
    }
    return null
  }

  defaultOrder (map, board, unit) {
    const $ = this.helper
    switch (board.state.phase) {
      case $.Movement: return this.movementValidator.defaultOrder(map, board, unit)
      case $.Retreat:
        break
      case $.Build:
        break
    }
    return null
  }
}

module.exports = new Rule()
