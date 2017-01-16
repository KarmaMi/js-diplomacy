package diplomacy.variant.standard.rule

import diplomacy.rule.InvalidOrderMessage

class RetreatOrderGenerator extends OrderGenerator {
  def ordersToSkipPhase(board: Board): Option[Set[Order]] = {
    val dislodgedUnits = board.unitStatuses collect {
      case (unit, x: UnitStatus.Dislodged[Power]) => unit -> x.attackedFrom // TODO
    }
    if (
      dislodgedUnits forall {
        case (unit, attackedFrom) =>
          RetreatPhaseUtils.locationsToRetreat(board)(unit, attackedFrom).isEmpty
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
