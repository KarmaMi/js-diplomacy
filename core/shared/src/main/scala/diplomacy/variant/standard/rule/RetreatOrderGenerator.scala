package diplomacy.variant.standard.rule

import diplomacy.rule.InvalidOrderMessage
import diplomacy.board.Power

class RetreatOrderGenerator[Turn_ <: Turn, Power_ <: Power] extends OrderGenerator[Turn_, Power_] {
  def ordersToSkipPhase(board: Board): Option[Set[Order]] = {
    val dislodgedUnits = board.unitStatuses collect {
      case (unit, x: UnitStatus.Dislodged[Power]) => unit -> x.attackedFrom
    }
    if (
      dislodgedUnits forall {
        case (unit, attackedFrom) =>
          StandardRuleUtils.locationsToRetreat(board)(unit, attackedFrom).isEmpty
      }
    ) {
      Option(
        (dislodgedUnits map { case (unit, _) => Order.Disband(unit) })(collection.breakOut)
      )
    } else {
      None
    }
  }
  def defaultOrder(board: Board)(unit: DiplomacyUnit): Order = Order.Disband(unit)
}
