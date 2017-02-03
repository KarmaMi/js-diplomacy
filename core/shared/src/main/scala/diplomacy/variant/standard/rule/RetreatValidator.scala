package diplomacy.variant.standard.rule

import scala.collection.{ mutable => cmutable }

import diplomacy.rule.InvalidOrderMessage
import diplomacy.board.Power

class RetreatValidator[Turn_ <: Turn, Power_ <: Power] extends Validator[Turn_, Power_] {
  def unitsRequiringOrder(board: Board): Set[DiplomacyUnit] = (board.unitStatuses collect {
    case (unit, UnitStatus.Dislodged(_)) => unit
  })(collection.breakOut)

  def errorMessageOfOrder(board: Board)(order: Order): Option[InvalidOrderMessage] = {
    // The order is invalid if order.unit is not dislodged
    val dislodgedUnits = (board.unitStatuses collect {
      case (unit, x: UnitStatus.Dislodged[Power]) => unit -> x.attackedFrom 
    }).toMap
    if (!(dislodgedUnits contains order.unit)) {
      Option(InvalidOrderMessage(s"${order.unit} is not dislodged."))
    } else {
      order match {
        case Order.Retreat(unit, destination) =>
          if (
            !(StandardRuleUtils.locationsToRetreat(board)(unit, dislodgedUnits(unit)) contains destination)
          ) {
            Option(InvalidOrderMessage(s"${unit} cannot retreat to ${destination}."))
          } else {
            None
          }
        case Order.Disband(_) => None
        case _ => Option(InvalidOrderMessage(s"${order} is not order for Retreat phase."))
      }
    }
  }
  def errorMessageOfOrders(board: Board)(order: Set[Order]): Option[InvalidOrderMessage] = {
    board.unitStatuses collectFirst {
      case (unit, UnitStatus.Dislodged(_)) if order forall { _.unit != unit } =>
        InvalidOrderMessage(s"${unit} has no order.")
    }
  }
}
