package diplomacy.variant.standard.rule

import scala.collection.{ mutable => cmutable }

import diplomacy.rule.InvalidOrderMessage

class MovementValidator extends Validator {
  def unitsRequiringOrder(board: Board): Set[DiplomacyUnit] = board.units

  def errorMessageOfOrder(board: Board)(order: Order): Option[InvalidOrderMessage] = {
    // The order is invalid if order.unit is not in board.
    if (board.units forall { _ != order.unit }) {
      Option(InvalidOrderMessage(s"${order.unit} does not exist."))
    } else {
      order match {
        case Order.Hold(_) => None
        case Order.Move(unit, destination, _) =>
          /*
          Move is valid if
          1. the unit can move to the destination or
          2. the unit is army, the location is coast, and the fleet can move to destination from the location.
          */
          if (board.map.movableLocationsOf(unit) contains destination) {
            None
          } else if (
            (unit.militaryBranch == MilitaryBranch.Army) &&
            this.isReachableViaSea(board.map, unit, destination.province)
          ) {
            None
          } else {
            Option(InvalidOrderMessage(s"${unit} cannot move to ${destination}."))
          }
        case s@ Order.Support(unit, target) =>
          // Support is valid if the destination can be moved.
          this.errorMessageOfOrder(board)(s.targetOrder) match {
            case x@ Some(_) => x
            case None =>
              if (board.map.movableLocationsOf(unit) contains s.destinationLocation) {
                None
              } else {
                Option(InvalidOrderMessage(s"${unit} cannot support ${s.targetOrder}."))
              }
          }
        case Order.Convoy(unit, target) =>
          /*
          Convoy is valid if
          1. the unit is fleet,
          2. the target is move order,
          3. the target is army,
          4. the location is sea, and
          5. the destination can be moved from the unit's location
          */
          this.errorMessageOfOrder(board)(target) match {
            case x@ Some(_) => x
            case None =>
              if (unit.militaryBranch != MilitaryBranch.Fleet) {
                Option(InvalidOrderMessage(s"${unit} is not fleet."))
              } else if (target.unit.militaryBranch != MilitaryBranch.Army) {
                Option(InvalidOrderMessage(s"${target.unit} is not army."))
              } else {
                val isSea =
                  board.map.locationsOf(unit.location.province) forall {
                    _.militaryBranches == Set(MilitaryBranch.Fleet)
                  }
                if (!isSea) {
                  Option(InvalidOrderMessage(s"${unit} is not on sea."))
                } else if (!this.isReachableViaSea(board.map, target.unit, target.destination.province)) {
                  Option(InvalidOrderMessage(
                    s"Moving from ${target.unit.location} to ${target.destination} via convoy is invalid."
                  ))
                } else if (!this.isReachableViaSea(board.map, unit, target.destination.province)) {
                  Option(InvalidOrderMessage(
                    s"Moving from ${unit.location} to ${target.destination} via convoy is invalid."
                  ))
                } else {
                  None
                }
              }
          }
        case _ => Option(InvalidOrderMessage(s"${order} is not order for Movement phase."))
      }
    }
  }
  def errorMessageOfOrders(board: Board)(order: Set[Order]): Option[InvalidOrderMessage] = None

  private[this] def isReachableViaSea(
    map: DiplomacyMap, unit: DiplomacyUnit, destination: Province
  ): Boolean = {
    val visited = cmutable.Set[Province]()
    def dfs(province: Province): Boolean = {
      visited += province
      var readable = true
      map.movableProvincesOf(province, MilitaryBranch.Fleet) filterNot { next =>
        // Already visited
        visited contains next
      } exists { next =>
        val isSea = map.locationsOf(next) forall { _.militaryBranches == Set(MilitaryBranch.Fleet) }
        if (next == destination) {
          true
        } else if (isSea) {
          visited += next
          dfs(next)
        } else {
          false
        }
      }
    }

    dfs(unit.location.province)
  }
}
