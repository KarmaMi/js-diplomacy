import { Validator } from "./validator"
import { StandardRuleUtils } from "./standard-rule-utils"
import { OrderType, Order, Disband, Retreat } from "./order"
import { MilitaryBranch, Dislodged } from "./data"
import { Board, Unit } from "./types"
import * as Error from "./error"

export class RetreatValidator<Power> implements Validator<Power> {
  unitsRequiringOrder (board: Board<Power>): Set<Unit<Power>> {
    return new Set([...board.unitStatuses].map(elem => elem[0]))
  }
  errorOfOrder (board: Board<Power>, order: Order<Power>) {
    // The order is invalid if order.unit is not dislodged
    const dislodged = board.unitStatuses.get(order.unit)

    if (!dislodged) {
      return new Error.CannotBeOrdered(order)
    }

    if (order instanceof Retreat) {
      const ls = StandardRuleUtils.locationsToRetreat(board, order.unit, dislodged.attackedFrom)
      if (!ls.has(order.destination)) {
        return new Error.UnmovableLocation(order.unit, order.destination)
      }
    } else if (!(order instanceof Disband)) {
      return new Error.InvalidPhase(order)
    }
    return null
  }

  errorOfOrders (board: Board<Power>, orders: Set<Order<Power>>) {
    for (let elem of [...board.unitStatuses]) {
      const [unit, status] = elem
      const hasOrder = [...orders].some(order => order.unit === unit)

      if (!hasOrder) {
        return new Error.OrderNotExisted(unit)
      }
    }
    return null
  }
}
