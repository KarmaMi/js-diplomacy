import { Unit, Board, ResolvedResult } from "./types"
import { Order } from "./order"
import { Error } from "./error"

export interface Validator<Power> {
  /**
   * @return The set of units that are requred orders.
   */
  unitsRequiringOrder (board: Board<Power>): Set<Unit<Power>>
  /**
   * @return The error message of the order. If the order is valid, it's null.
   */
  errorMessageOfOrder (board: Board<Power>, order: Order<Power>): Error | null
  /**
   * @return The error message of the orders. If the set of the orders is valid, it's null.
   */
  errorMessageOfOrders (board: Board<Power>, orders: Set<Order<Power>>): Error | null
}
