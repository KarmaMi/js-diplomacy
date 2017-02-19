import { Validator } from "./validator"
import { StandardRuleUtils } from "./standard-rule-utils"
import { OrderType, Order, Disband, Retreat } from "./order"
import { Dislodged } from "./dislodged"
import { Board, Unit } from "./types"

export class RetreatValidator<Power> implements Validator<Power> {
  unitsRequiringOrder (board: Board<Power>) {
    return new Set([...board.unitStatuses].map(elem => elem[0]))
  }
  errorMessageOfOrder (board: Board<Power>, order: Order<Power>) {
    // The order is invalid if order.unit is not dislodged
    const dislodged = [...board.unitStatuses].some(elem => {
      const unit = elem[0]
      return (unit.militaryBranch === order.unit.militaryBranch) &&
        (unit.location === order.unit.location) &&
        (unit.power === order.unit.power)
    })

    if (!dislodged) {
      return `${order.unit} is not dislodged`
    }

    // unitStatuses.find(...) is not null because disloged is true
    const status = (<[Unit<Power>, Dislodged<Power>]>[...board.unitStatuses].find(elem => {
      const unit = elem[0]
      return (unit.militaryBranch === order.unit.militaryBranch) &&
        (unit.location === order.unit.location) &&
        (unit.power === order.unit.power)
    }))[1]

    if (order instanceof Retreat) {
      const ls = StandardRuleUtils.locationsToRetreat(board, order.unit, status.attackedFrom)
      if (!ls.has(order.destination)) {
        return `${order.unit} cannot retreat to ${order.destination}`
      }
    } else if (!(order instanceof Disband)) {
      return `${order} is for Retreat phase`
    }
    return null
  }

  errorMessageOfOrders (board: Board<Power>, orders: Set<Order<Power>>) {
    for (let elem of [...board.unitStatuses]) {
      const [unit, status] = elem
      const hasOrder = [...orders].some(order => {
        return (unit.militaryBranch === order.unit.militaryBranch) &&
          (unit.location === order.unit.location) &&
          (unit.power === order.unit.power)
      })

      if (!hasOrder) {
        return `${unit} has no order`
      }
    }
    return null
  }
}
