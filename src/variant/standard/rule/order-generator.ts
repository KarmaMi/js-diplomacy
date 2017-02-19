import { Unit, Board, ResolvedResult } from "./types"
import { Order } from "./order"

export interface OrderGenerator<Power> {
  ordersToSkipPhase (board: Board<Power>): Set<Order<Power>> | null
  /**
   * @return The default order of the unit. If there are no default order, it's null.
   */
  defaultOrderOf (board: Board<Power>, unit: Unit<Power>): Order<Power> | null
}
