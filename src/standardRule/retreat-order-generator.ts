import { OrderGenerator } from "./order-generator"
import { Utils } from "./utils"
import { Disband } from "./order"
import { Board, Unit } from "./types"

export class RetreatOrderGenerator<Power> implements OrderGenerator<Power> {
  ordersToSkipPhase (board: Board<Power>) {
    if (board.unitStatuses.size === 0) {
      return new Set()
    }
    if (
      [...board.unitStatuses].every(elem => {
        const [unit, status] = elem
        const locations = Utils.locationsToRetreat(board, unit, status.attackedFrom)
        return locations.size === 0
      })
    ) {
      // Disband all dislodged units
      const retval = new Set()
      board.unitStatuses.forEach((status, unit) => {
        retval.add(new Disband(unit))
      })
      return retval
    }
    return null
  }
  defaultOrderOf (board: Board<Power>, unit: Unit<Power>) {
    return new Disband(unit)
  }
}
