const Name = require('../../data/name')
const BaseRule = require('../../rule/rule')
const RuleHelper = require('../../rule/rule-helper')
const Order = require('./order')
const MovementResolver = require('./movement-resolver')
const MovementValidator = require('./movement-validator')
const RetreatResolver = require('./retreat-resolver')
const RetreatValidator = require('./retreat-validator')
const BuildResolver = require('./build-resolver')
const BuildValidator = require('./build-validator')
const StandardRuleUtil = require('./standard-rule-util')

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
    this.buildResolver = new BuildResolver(this)
    this.buildValidator = new BuildValidator(this)
    this.helper = new RuleHelper(this)
  }

  _resolveOrder (map, board, orders) {
    const $ = this.helper
    const f = () => {
      switch (board.state.phase) {
        case $.Movement: return this.movementResolver.resolve(map, board, orders)
        case $.Retreat: return this.retreatResolver.resolve(map, board, orders)
        case $.Build: return this.buildResolver.resolve(map, board, orders)
      }
    }

    const result = f()

    if (!result) return null

    if (this.canSkipPhase(map, result.board)) {
      const result2 = this.resolve(map, result.board, this.getOrdersForSkipPhase(map, result.board))
      const orderResult = new Map([...result.orderResult])
      result2.orderResult.forEach((value, key) => orderResult.set(key, value))
      return { board: result2.board, orderResult: orderResult }
    }

    return result
  }

  canSkipPhase (map, board) {
    return this.getOrdersForSkipPhase(map, board)
  }

  getOrdersForSkipPhase (map, board) {
    const $ = this.helper
    switch (board.state.phase) {
      case $.Movement: return null
      case $.Retreat:
        if (board.unitsStatus.size === 0) {
          return []
        }
        if (
          [...board.unitsStatus].every(elem => {
            return [...elem[1]].every(elem2 => {
              const [unit, status] = elem2
              if (status.status !== $.Dislodged) return false
              const locations = StandardRuleUtil.locationsCanBeRetreated(
                this, map, board, unit, status.attackedFrom
              )
              return locations.length === 0
            })
          })
        ) {
          // Disband all dislodged units
          const Disband = this.orders.get('disband')
          return [...board.unitsStatus].map(elem => {
            return [...elem[1]].map(elem2 => new Disband(elem2[0]))
          }).reduce((sum, elem) => sum.concat(elem), [])
        }
        return null
      case $.Build: return null
    }
    return null
  }

  getErrorMessageForOrder (map, board, order) {
    const $ = this.helper
    switch (board.state.phase) {
      case $.Movement: return this.movementValidator.getErrorMessageForOrder(map, board, order)
      case $.Retreat: return this.retreatValidator.getErrorMessageForOrder(map, board, order)
      case $.Build: return this.buildValidator.resolve(map, board, orders)
    }
    return null
  }

  getErrorMessageForOrders (map, board, orders) {
    const $ = this.helper
    switch (board.state.phase) {
      case $.Movement: return this.movementValidator.getErrorMessageForOrders(map, board, orders)
      case $.Retreat: return this.retreatValidator.getErrorMessageForOrders(map, board, orders)
      case $.Build: return this.buildValidator.getErrorMessageForOrders(map, board, orders)
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
