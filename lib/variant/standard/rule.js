const BaseRule = require('../../rule/rule')
const RuleKeywordsHelper = require('../../rule/rule-keywords-helper')
const Order = require('./order')
const MovementResolver = require('./movement-resolver')
const MovementValidator = require('./movement-validator')
const RetreatResolver = require('./retreat-resolver')
const RetreatValidator = require('./retreat-validator')
const BuildResolver = require('./build-resolver')
const BuildValidator = require('./build-validator')
const StandardRuleUtil = require('./standard-rule-util')

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
    this.retreatResolver = new RetreatResolver()
    this.retreatValidator = new RetreatValidator()
    this.buildResolver = new BuildResolver()
    this.buildValidator = new BuildValidator()
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
    const Disband = ruleKeywords.orders.get('disband')

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
      case $.Build:
        let canSkip = true
        const orders = []
        const forces = new Set([...board.units.keys()].concat([...board.occupation.keys()]))

        forces.forEach(force => {
          const numOfUnits = [...(board.units.get(force) || [])].length
          const numOfSupply = board.numberOfsupplyCenters(force)
          if (numOfUnits !== numOfSupply && numOfSupply !== 0) canSkip = false

          if (numOfSupply === 0) {
            (board.units.get(force) || []).forEach(unit => orders.push(new Disband(unit)))
          }
        })

        if (canSkip) return orders

        return null
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
      case $.Movement: return this.movementValidator.defaultOrder(map, board, unit)
      case $.Retreat: return this.retreatValidator.defaultOrder(map, board, unit)
      case $.Build: return this.buildValidator.defaultOrder(map, board, unit)
    }
    return null
  }
}
