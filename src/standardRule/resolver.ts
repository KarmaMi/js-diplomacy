import { Board, ResolvedResult } from "./types"
import { util } from "./../util"
import { Order } from "./order"

export interface Resolver<Power> {
  /**
   * Resolve the orders, and creates result
   * @return The result of the orders.
   */
  resolve(
    board: Board<Power>, orders: Set<Order<Power>>
  ): util.Success<ResolvedResult<Power>>
}
