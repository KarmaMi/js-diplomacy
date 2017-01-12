package diplomacy.variant.standard.rule

import diplomacy.rule.InvalidOrderMessage

class MovementOrderGenerator extends OrderGenerator {
  def ordersToSkipPhase(board: Board): Option[Set[Order]] = {
    if (board.units.isEmpty) {
      Option(Set())
    } else {
      None
    }
  }
  def defaultOrder(board: Board)(unit: DiplomacyUnit): Order = Order.Hold(unit)
}
