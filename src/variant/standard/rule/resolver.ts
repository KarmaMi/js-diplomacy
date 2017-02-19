import { Board, ResolvedResult } from "./types"
import { Success } from "./../../../util/module"
import { Order } from "./order"

export interface Resolver<Power> {
  /**
   * Resolve the orders, and creates result
   * @return The result of the orders.
   */
  resolve(
    board: Board<Power>, orders: Set<Order<Power>>
  ): Success<string, ResolvedResult<Power>>
}
