'use strict'

import { Board, Unit, ResolvedResult } from "./types"
import { Order } from "./order"
import { Phase } from "./phase"
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
import { MilitaryBranch } from "./military-branch"
import { State } from "./state"
import { Dislodged } from "./dislodged"
import { ProvinceStatus } from "./province-status"
import { Result } from "./result"
import { Error } from "./error"
import { Rule as BaseRule } from "../../../rule/module"
import { Success, Failure } from "../../../util/module"

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
  extends BaseRule<Power, MilitaryBranch, State, Dislodged<Power>, ProvinceStatus<Power>, Result, Error> {
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

  protected resolveProcedure (board: Board<Power>, orders: Set<Order<Power>>) {
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

  protected errorMessageOfOrder (board: Board<Power>, order: Order<Power>) {
    const ruleOpt = this.phaseRules.get(board.state.phase)
    if (!ruleOpt) {
      throw `invalid phase: ${board.state.phase}`
    }
    return ruleOpt.validator.errorMessageOfOrder(board, order)
  }

  protected errorMessageOfOrders (board: Board<Power>, orders: Set<Order<Power>>) {
    const ruleOpt = this.phaseRules.get(board.state.phase)
    if (!ruleOpt) {
      throw `invalid phase: ${board.state.phase}`
    }
    return ruleOpt.validator.errorMessageOfOrders(board, orders)
  }

  protected defaultOrderOf (board: Board<Power>, unit: Unit<Power>) {
    const ruleOpt = this.phaseRules.get(board.state.phase)
    if (!ruleOpt) {
      throw `invalid phase: ${board.state.phase}`
    }
    return ruleOpt.orderGenerator.defaultOrderOf(board, unit)
  }
}
