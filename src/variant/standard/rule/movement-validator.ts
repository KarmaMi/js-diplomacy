import { Validator } from "./validator"
import { StandardRuleUtils } from "./standard-rule-utils"
import { Order, Retreat, Hold, Move, Support, Convoy } from "./order"
import { MilitaryBranch } from "./military-branch"
import { Dislodged } from "./dislodged"
import { Board, Unit } from "./types"

const { Army, Fleet } = MilitaryBranch

export class MovementValidator<Power> implements Validator<Power> {
  unitsRequiringOrder (board: Board<Power>) {
    return board.units
  }
  errorMessageOfOrder (board: Board<Power>, o: Order<Power>): string | null {
    // The order is invalid if order.unit is not in board.
    if (!board.units.has(o.unit)) {
      return `${o.unit} does not exist`
    }
    if (o instanceof Hold) {
      return null
    } else if (o instanceof Move) {
      // TODO the type of `o` is inferred as `never`
      const order: Move<Power> = o
      /*
      Move is valid if
      1. the unit can move to the destination or
      2. the unit is army, the location is coast, and the fleet can move to destination from the location.
      */
      if (StandardRuleUtils.movableLocationsOf(board, order.unit).has(order.destination)) {
        return null
      } else {
        return `${order.unit} cannot move to ${order.destination}`
      }
    } else if (o instanceof Support) {
      const order: Support<Power> = o
      // Support is valid if the destination can be moved.
      const msgForTarget = this.errorMessageOfOrder(board, order.target)
      if (msgForTarget) {
        return msgForTarget
      } else {
        if (
          board.map.movableLocationsOf(order.unit.location, order.unit.militaryBranch).has(order.destination)
        ) {
          return null
        } else {
          return `${order.unit} cannot support ${order.target}`
        }
      }
    } else if (o instanceof Convoy) {
      const order: Convoy<Power> = o
      /*
      Convoy is valid if
      1. the unit is fleet,
      2. the target is move order,
      3. the target is army,
      4. the location is sea, and
      5. the destination can be moved from the unit's location
      */
      const msg = this.errorMessageOfOrder(board, order.target)
      if (msg) {
        return msg
      } else {
        if (order.unit.militaryBranch !== Fleet) {
          return `${order.unit} is not fleet`
        } else if (order.target.unit.militaryBranch !== Army) {
          return `${order.target.unit} is not army`
        } else {
          if (!StandardRuleUtils.isSea(board.map, order.unit.location.province)) {
            return `${order.unit} is not on sea`
          } else if (
            !StandardRuleUtils.isMovableViaSea(
              board.map, order.target.unit.location.province, order.target.destination.province,
              board.units
            )
          ) {
            return `Moving from ${order.target.unit.location} to ${order.target.destination} via convoy is invalid`
          } else if (
            !StandardRuleUtils.isMovableViaSea(
              board.map, order.unit.location.province, order.target.destination.province,
              board.units
            )
          ) {
            return `Moving from ${order.unit.location} to ${order.target.destination} via convoy is invalid`
          }
        }
      }
    }
    return `${o} is not for Movement phase`
  }
  errorMessageOfOrders (board: Board<Power>, orders: Set<Order<Power>>) {
    return null
  }
}
