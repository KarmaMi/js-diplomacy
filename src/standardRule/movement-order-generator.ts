import { OrderGenerator } from "./order-generator"
import { Hold } from "./order"
import { Board, Unit } from "./types"

export class MovementOrderGenerator<Power> implements OrderGenerator<Power> {
  defaultOrderOf (board: Board<Power>, unit: Unit<Power>) {
    return new Hold(unit)
  }

  ordersToSkipPhase (board: Board<Power>) {
    if (board.units.size === 0) {
      return new Set()
    } else {
      return null
    }
  }
}
