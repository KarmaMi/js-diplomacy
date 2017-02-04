const { Rule: BaseRule, ResolvedResult } = require('../../../rule/package')
const { Movement, Retreat, Build } = require('./phase')
const MovementResolver = require('./movement-resolver')
const MovementValidator = require('./movement-validator')
const MovementOrderGenerator = require('./movement-order-generator')
const RetreatResolver = require('./retreat-resolver')
const RetreatValidator = require('./retreat-validator')
const RetreatOrderGenerator = require('./retreat-order-generator')
const BuildResolver = require('./build-resolver')
const BuildValidator = require('./build-validator')
const BuildOrderGenerator = require('./build-order-generator')

class PhaseRule {
  constructor (resolver, validator, orderGenerator) {
    this.resolver = resolver
    this.validator = validator
    this.orderGenerator = orderGenerator
  }
}

module.exports = class Rule extends BaseRule {
  constructor () {
    super()
    this.phaseRules = new Map([
      [
        Movement,
        new PhaseRule(new MovementResolver(), new MovementValidator(), new MovementOrderGenerator())
      ],
      [
        Retreat,
        new PhaseRule(new RetreatResolver(), new RetreatValidator(), new RetreatOrderGenerator())
      ],
      [
        Build,
        new PhaseRule(new BuildResolver(), new BuildValidator(), new BuildOrderGenerator())
      ]
    ])
  }

  resolveProcedure (board, orders) {
    const { resolver, validator, orderGenerator: generator } =
      this.phaseRules.get(board.state.phase)
    const r1 = resolver.resolve(board, orders)
    if (r1.err) {
      return r1
    }

    const result = r1.result
    const orders2 =
      this.phaseRules.get(result.board.state.phase).orderGenerator.ordersToSkipPhase(result.board)

    if (!orders2) {
      return r1
    }

    const r2 = this.resolve(result.board, orders2)
    if (r2.err) {
      return r2
    }

    const result2 = r2.result

    const orderResults = new Set([...result.results])
    result2.results.forEach(r => orderResults.add(r))
    return {
      result:
        new ResolvedResult(result2.board, orderResults, result.isFinished || result2.isFinished)
    }
  }

  unitsRequiringOrder (board) {
    return this.phaseRules.get(board.state.phase).validator.unitsRequiringOrder(board)
  }

  errorMessageOfOrder (board, order) {
    return this.phaseRules.get(board.state.phase).validator.errorMessageOfOrder(board, order)
  }

  errorMessageOfOrders (board, orders) {
    return this.phaseRules.get(board.state.phase).validator.errorMessageOfOrders(board, orders)
  }

  defaultOrderOf (board, unit) {
    return this.phaseRules.get(board.state.phase).orderGenerator.defaultOrderOf(board, unit)
  }
}
