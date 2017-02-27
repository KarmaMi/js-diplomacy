'use strict'

import { Board, Unit, ResolvedResult } from "./types"
import { Order } from "./order"
import { Phase, State, Dislodged, ProvinceStatus, Result, MilitaryBranch } from "./data"
import { Resolver } from "./resolver"
import { Validator } from "./validator"
import { OrderGenerator } from "./order-generator"
import { MovementResolver } from "./movement-resolver"
import { MovementValidator } from "./movement-validator"
import { MovementOrderGenerator } from "./movement-order-generator"
import { RetreatResolver } from "./retreat-resolver"
import { RetreatValidator } from "./retreat-validator"
import { RetreatOrderGenerator } from "./retreat-order-generator"
import { BuildResolver } from "./build-resolver"
import { BuildValidator } from "./build-validator"
import { BuildOrderGenerator } from "./build-order-generator"
import { Error, SeveralOrders } from "./error"
import { rule } from "./../rule"
import { util } from "./../util"

const { Success, Failure } = util
const { Movement, Retreat, Build } = Phase

class PhaseRule<Power> {
  constructor (
    public resolver: Resolver<Power>,
    public validator: Validator<Power>,
    public orderGenerator: OrderGenerator<Power>
  ) {}
}

/**
 * Standard rule of Diplomacy
 */
export class Rule<Power>
  extends rule.Rule<Power, MilitaryBranch, State, Dislodged<Power>, ProvinceStatus<Power>, Result, Error> {
  private phaseRules: Map<Phase, PhaseRule<Power>>
  /**
   * @param stringify Stringify instances of Power
   */
  constructor () {
    super()
    this.phaseRules = new Map([
      [
        Movement,
        new PhaseRule(
          new MovementResolver<Power>(), new MovementValidator<Power>(),
          new MovementOrderGenerator<Power>()
        )
      ],
      [
        Retreat,
        new PhaseRule(
          new RetreatResolver<Power>(), new RetreatValidator<Power>(),
          new RetreatOrderGenerator<Power>()
        )
      ],
      [
        Build,
        new PhaseRule(
          new BuildResolver<Power>(), new BuildValidator<Power>(),
          new BuildOrderGenerator<Power>()
        )
      ]
    ])
  }

  protected resolveProcedure (
    board: Board<Power>, orders: Set<Order<Power>>
  ): util.ResultOrFail<Error, ResolvedResult<Power>> {
    const unitsHaveSeveralOrders = new Set(
      [...orders].filter(order => {
        return [...orders].some(order2 => order !== order2 && order.unit === order2.unit)
      }).map(order => order.unit)
    )
    if (unitsHaveSeveralOrders.size !== 0) {
      return new Failure(new SeveralOrders(unitsHaveSeveralOrders))
    }

    const ruleOpt = this.phaseRules.get(board.state.phase)

    if (!ruleOpt) {
      throw `invalid phase: ${board.state.phase}`
    }

    const { resolver } = ruleOpt
    const r1 = resolver.resolve(board, orders)
    if (!r1.result) {
      return r1
    }

    const result = r1.result
    const ruleOpt2 = this.phaseRules.get(result.board.state.phase)
    if (!ruleOpt2) {
      throw `Invalid phase: ${result.board.state.phase}`
    }

    const orders2 = ruleOpt2.orderGenerator.ordersToSkipPhase(result.board)

    if (!orders2) {
      return r1
    }

    const r2 = this.resolve(result.board, orders2)
    if (!r2.result) {
      return r2
    }

    const result2 = r2.result

    const orderResults = new Set([...result.results])
    result2.results.forEach(r => orderResults.add(r))
    return new Success(
      new ResolvedResult(result2.board, orderResults, result.isFinished || result2.isFinished)
    )
  }

  protected unitsRequiringOrder (board: Board<Power>) {
    const ruleOpt = this.phaseRules.get(board.state.phase)
    if (!ruleOpt) {
      throw `invalid phase: ${board.state.phase}`
    }
    return ruleOpt.validator.unitsRequiringOrder(board)
  }

  protected errorOfOrder (board: Board<Power>, order: Order<Power>) {
    const ruleOpt = this.phaseRules.get(board.state.phase)
    if (!ruleOpt) {
      throw `invalid phase: ${board.state.phase}`
    }
    return ruleOpt.validator.errorOfOrder(board, order)
  }

  protected errorOfOrders (board: Board<Power>, orders: Set<Order<Power>>) {
    const ruleOpt = this.phaseRules.get(board.state.phase)
    if (!ruleOpt) {
      throw `invalid phase: ${board.state.phase}`
    }
    return ruleOpt.validator.errorOfOrders(board, orders)
  }

  protected defaultOrderOf (board: Board<Power>, unit: Unit<Power>) {
    const ruleOpt = this.phaseRules.get(board.state.phase)
    if (!ruleOpt) {
      throw `invalid phase: ${board.state.phase}`
    }
    return ruleOpt.orderGenerator.defaultOrderOf(board, unit)
  }
}
