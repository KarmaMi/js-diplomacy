import { Validator } from "./validator"
import { StandardRuleUtils } from "./standard-rule-utils"
import { Order, Retreat, Hold, Move, Support, Convoy } from "./order"
import { MilitaryBranch } from "./military-branch"
import { Dislodged } from "./dislodged"
import { Board, Unit } from "./types"
import * as Error from "./error"

const { Army, Fleet } = MilitaryBranch

export class MovementValidator<Power> implements Validator<Power> {
  unitsRequiringOrder (board: Board<Power>): Set<Unit<Power>> {
    return board.units
  }
  errorOfOrder (board: Board<Power>, o: Order<Power>): Error.Error | null {
    // The order is invalid if order.unit is not in board.
    if (!board.units.has(o.unit)) {
      return new Error.UnitNotExisted(o.unit)
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
        return new Error.UnmovableLocation(order.unit, order.destination)
      }
    } else if (o instanceof Support) {
      const order: Support<Power> = o
      // Support is valid if the destination can be moved.
      const msgForTarget = this.errorOfOrder(board, order.target)
      if (msgForTarget) {
        return msgForTarget
      } else {
        if (
          board.map.movableLocationsOf(order.unit.location, order.unit.militaryBranch).has(order.destination)
        ) {
          return null
        } else {
          return new Error.UnsupportableLocation(order.unit, order.destination)
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
      const msg = this.errorOfOrder(board, order.target)
      if (msg) {
        return msg
      } else {
        if (order.unit.militaryBranch !== Fleet) {
          return new Error.CannotBeOrdered(order)
        } else if (order.target.unit.militaryBranch !== Army) {
          return new Error.CannotBeOrdered(order)
        } else {
          if (!StandardRuleUtils.isSea(board.map, order.unit.location.province)) {
            return new Error.CannotBeOrdered(order)
          } else if (
            !StandardRuleUtils.isMovableViaSea(
              board.map, order.target.unit.location.province, order.target.destination.province,
              board.units
            )
          ) {
            return new Error.UnmovableLocation(order.target.unit, order.target.destination)
          } else if (
            !StandardRuleUtils.isMovableViaSea(
              board.map, order.unit.location.province, order.target.destination.province,
              board.units
            )
          ) {
            return new Error.UnconvoyableLocation(order.unit, order.target.destination)
          }
        }
      }
    }
    return new Error.InvalidPhase(o)
  }
  errorOfOrders (board: Board<Power>, orders: Set<Order<Power>>) {
    return null
  }
}
