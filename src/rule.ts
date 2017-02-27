import { board } from "./board"
import { util } from "./util"
declare type Success<R> = util.Success<R>
declare type Failure<R> = util.Failure<R>

export namespace rule {
  export interface Order<Power, MilitaryBranch> {
    /**
     * The unit of Diplomacy that corresponds to this order.
     */
    unit: board.Unit<Power, MilitaryBranch>
  }

  export interface OrderResult<Power, MilitaryBranch, Result> {
    /**
     * The target order.
     */
    target: Order<Power, MilitaryBranch>
    /**
     * The result of the target.
     */
    result: Result
  }

  /**
   * Result of an order execution.
   */
  export class Executed<Power, MilitaryBranch, Result>
    implements OrderResult<Power, MilitaryBranch, Result> {
    /**
     * @param target The target order.
     * @param result The result of the target.
     */
    constructor (public target: Order<Power, MilitaryBranch>, public result: Result) {}
  }
  /**
   * Result of an order execution. It is used when the original order is replaced.
   */
  export class Replaced<Power, MilitaryBranch, Result>
    implements OrderResult<Power, MilitaryBranch, Result> {
    /**
     * @param target The target order.
     * @param result The result of the target.
     * @param invalidReason The reason why the target is replaced
     * @param replacedBy The order that replaces the target.
     */
    constructor (
      public target: Order<Power, MilitaryBranch>,
      public invalidReason: string,
      public replacedBy: Order<Power, MilitaryBranch>,
      public result: Result
    ) {}
  }

  export class ResolvedResult<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus, Result> {
    /**
     * The set of order results
     */
    results: Set<OrderResult<Power, MilitaryBranch, Result>>
    /**
     * @param board
     * @param results The set of order results
     * @param isFinished The flag whether this game is finished or not.
     */
    constructor (
      public board: board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
      results: Set<OrderResult<Power, MilitaryBranch, Result>> | Array<OrderResult<Power, MilitaryBranch, Result>>,
      public isFinished: boolean
    ) {
      this.results = new Set([...results])
    }
  }

  /**
   * Rule of Diplomacy
   */
  export abstract class Rule<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus, Result, Error> {
    /**
     * Resolves orders and creates a result.
     * @param board
     * @param orders The set of orders to be resolved.
     * @return The result of the orders
     */
    resolve (
      board: board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
      orders: Set<Order<Power, MilitaryBranch>>
    ): util.ResultOrFail<Error, ResolvedResult<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus, Result>> {
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
        const msg = this.errorOfOrder(board, order)
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

      // TODO rename errorOfOrders
      const msg = this.errorOfOrders(board, os)
      if (msg) {
        // Reject if the set of the orders is invalid
        return new util.Failure(msg)
      }

      const result = this.resolveProcedure(board, os)

      if (result instanceof util.Success) {
        const newResults = result.result.results
        replaced.forEach((value, replacedOrder) => {
          const [order, message] = value
          const result = [...newResults].find(r => r.target === replacedOrder)
          if (result) {
            newResults.delete(result)
            newResults.add(new Replaced(order, message, result.target, result.result))
          }
        })

        return new util.Success(
          new ResolvedResult(result.result.board, newResults, result.result.isFinished)
        )
      }

      return new util.Failure(result.err)
    }

    /**
     * @return The set of units that are requred orders.
     */
    protected abstract unitsRequiringOrder (
      board: board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>
    ): Set<board.Unit<Power, MilitaryBranch>>
    /**
     * @return The default order of the unit. If there are no default order, it's null.
     */
    protected abstract defaultOrderOf (
      board: board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
      unit: board.Unit<Power, MilitaryBranch>
    ): Order<Power, MilitaryBranch> | null
    /**
     * @return The error message of the order. If the order is valid, it's null.
     */
    protected abstract errorOfOrder (
      board: board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
      order: Order<Power, MilitaryBranch>
    ): Error | null
    /**
     * @return The error message of the orders. If the set of the orders is valid, it's null.
     */
    protected abstract errorOfOrders (
      board: board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
      orders: Set<Order<Power, MilitaryBranch>>
    ): Error | null
    /**
     * Resolve the orders, and creates result
     * @return The result of the orders.
     */
    protected abstract resolveProcedure (
      board: board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
      orders: Set<Order<Power, MilitaryBranch>>
    ): util.ResultOrFail<Error, ResolvedResult<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus, Result>>
  }

}
