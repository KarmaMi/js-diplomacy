import { Unit, Board } from "./../board/module"
import { ResultOrFail, Success, Failure } from "./../util/module"
import { Replaced } from "./order-result"
import { ResolvedResult } from "./resolved-result"
import { Order } from "./order"

/**
 * Rule of Diplomacy
 */
export abstract class Rule<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus, Result> {
  /**
   * Resolves orders and creates a result.
   * @param board
   * @param orders The set of orders to be resolved.
   * @return The result of the orders
   */
  resolve (
    board: Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
    orders: Set<Order<Power, MilitaryBranch>>
  ): ResultOrFail<string, ResolvedResult<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus, Result>> {
    const unitsHaveSeveralOrders = new Set(
      [...orders].filter(order => {
        return [...orders].some(order2 => order !== order2 && order.unit === order2.unit)
      }).map(order => order.unit)
    )
    if (unitsHaveSeveralOrders.size !== 0) {
      throw `${[...unitsHaveSeveralOrders].join(', ')}: several orders`
    }

    const os = new Set([...orders])
    // Add a default orders if an unit requiring an order has no order
    for (let unit of [...this.unitsRequiringOrder(board)]) {
      if ([...orders].every(o => o.unit !== unit)) {
        const order = this.defaultOrderOf(board, unit)
        if (order) {
          os.add(order)
        } else {
          throw `${unit}: no order`
        }
      }
    }

    // Replace from invalid orders to default orders
    const replaced = new Map()
    os.forEach(order => {
      const msg = this.errorMessageOfOrder(board, order)
      if (msg) {
        const replacedOrder = this.defaultOrderOf(board, order.unit)
        os.delete(order)
        if (replacedOrder) {
          os.add(replacedOrder)
          replaced.set(replacedOrder, [order, msg])
        } else {
          throw `${order.unit}: no order`
        }
      }
    })

    const msg = this.errorMessageOfOrders(board, os)
    if (msg) {
      // Reject if the set of the orders is invalid
      return new Failure(msg)
    }

    const result = this.resolveProcedure(board, os)

    if (result.result) {
      const newResults = result.result.results
      replaced.forEach((value, replacedOrder) => {
        const [order, message] = value
        const result = [...newResults].find(r => r.target === replacedOrder)
        if (result) {
          newResults.delete(result)
          newResults.add(new Replaced(order, message, result.target, result.result))
        }
      })

      return new Success(
        new ResolvedResult(result.result.board, newResults, result.result.isFinished)
      )
    }

    return new Failure(result.err || "")
  }

  /**
   * @return The set of units that are requred orders.
   */
  protected abstract unitsRequiringOrder (
    board: Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>
  ): Set<Unit<Power, MilitaryBranch>>
  /**
   * @return The default order of the unit. If there are no default order, it's null.
   */
  protected abstract defaultOrderOf (
    board: Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
    unit: Unit<Power, MilitaryBranch>
  ): Order<Power, MilitaryBranch> | null
  /**
   * @return The error message of the order. If the order is valid, it's null.
   */
  protected abstract errorMessageOfOrder (
    board: Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
    order: Order<Power, MilitaryBranch>
  ): string | null
  /**
   * @return The error message of the orders. If the set of the orders is valid, it's null.
   */
  protected abstract errorMessageOfOrders (
    board: Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
    orders: Set<Order<Power, MilitaryBranch>>
  ): string | null
  /**
   * Resolve the orders, and creates result
   * @return The result of the orders.
   */
  protected abstract resolveProcedure (
    board: Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
    orders: Set<Order<Power, MilitaryBranch>>
  ): ResultOrFail<string, ResolvedResult<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus, Result>>
}
