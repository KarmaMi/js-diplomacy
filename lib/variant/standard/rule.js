const BaseRule = require('../../rule/rule')
const RuleKeywordsHelper = require('../../rule/rule-keywords-helper')
const Order = require('./order')
const MovementResolver = require('./movement-resolver')
const MovementValidator = require('./movement-validator')
const MovementOrderGenerator = require('./movement-order-generator')
const RetreatResolver = require('./retreat-resolver')
const RetreatValidator = require('./retreat-validator')
const RetreatOrderGenerator = require('./retreat-order-generator')
const BuildResolver = require('./build-resolver')
const BuildValidator = require('./build-validator')
const BuildOrderGenerator = require('./build-order-generator')

const ruleKeywords = require('./rule-keywords')
const $ = RuleKeywordsHelper(ruleKeywords)

// Orders
const orders = []
for (const name in Order) {
  orders.push([name.toLowerCase(), Order[name]])
}

module.exports = class Rule extends BaseRule {
  constructor () {
    super()

    this.movementResolver = new MovementResolver()
    this.movementValidator = new MovementValidator()
    this.movementOrderGenerator = new MovementOrderGenerator()
    this.retreatResolver = new RetreatResolver()
    this.retreatValidator = new RetreatValidator()
    this.retreatOrderGenerator = new RetreatOrderGenerator()
    this.buildResolver = new BuildResolver()
    this.buildValidator = new BuildValidator()
    this.buildOrderGenerator = new BuildOrderGenerator()
  }

  _resolveOrder (map, board, orders) {
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
      const result2 = this.resolve(map, result.board, this.getOrdersToSkipPhase(map, result.board))
      const orderResult = new Map([...result.orderResult])
      result2.orderResult.forEach((value, key) => orderResult.set(key, value))
      return { board: result2.board, orderResult: orderResult }
    }

    return result
  }

  canSkipPhase (map, board) {
    return this.getOrdersToSkipPhase(map, board)
  }

  getOrdersToSkipPhase (map, board) {
    const Disband = ruleKeywords.orders.get('disband')

    switch (board.state.phase) {
      case $.Movement: return this.movementOrderGenerator.getOrdersToSkipPhase(map, board)
      case $.Retreat: return this.retreatOrderGenerator.getOrdersToSkipPhase(map, board)
      case $.Build: return this.buildOrderGenerator.getOrdersToSkipPhase(map, board)
    }
    return null
  }

  getErrorMessageForOrder (map, board, order) {
    switch (board.state.phase) {
      case $.Movement: return this.movementValidator.getErrorMessageForOrder(map, board, order)
      case $.Retreat: return this.retreatValidator.getErrorMessageForOrder(map, board, order)
      case $.Build: return this.buildValidator.getErrorMessageForOrder(map, board, order)
    }
    return null
  }

  getErrorMessageForOrders (map, board, orders) {
    switch (board.state.phase) {
      case $.Movement: return this.movementValidator.getErrorMessageForOrders(map, board, orders)
      case $.Retreat: return this.retreatValidator.getErrorMessageForOrders(map, board, orders)
      case $.Build: return this.buildValidator.getErrorMessageForOrders(map, board, orders)
    }
    return null
  }

  defaultOrder (map, board, unit) {
    switch (board.state.phase) {
      case $.Movement: return this.movementOrderGenerator.defaultOrder(map, board, unit)
      case $.Retreat: return this.retreatOrderGenerator.defaultOrder(map, board, unit)
      case $.Build: return this.buildOrderGenerator.defaultOrder(map, board, unit)
    }
    return null
  }

  getUnitsRequiringOrder (map, board) {
    switch (board.state.phase) {
      case $.Movement: return this.movementValidator.getUnitsRequiringOrder(map, board)
      case $.Retreat: return this.retreatValidator.getUnitsRequiringOrder(map, board)
      case $.Build: return this.buildValidator.getUnitsRequiringOrder(map, board)
    }
    return []
  }
}
