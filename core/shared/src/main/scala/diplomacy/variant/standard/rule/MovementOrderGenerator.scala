package diplomacy.variant.standard.rule

import diplomacy.rule.InvalidOrderMessage
import diplomacy.board.Power

class MovementOrderGenerator[Turn_ <: Turn, Power_ <: Power] extends OrderGenerator[Turn_, Power_] {
  def ordersToSkipPhase(board: Board): Option[Set[Order]] = {
    if (board.units.isEmpty) {
      Option(Set())
    } else {
      None
    }
  }
  def defaultOrder(board: Board)(unit: DiplomacyUnit): Order = Order.Hold(unit)
}
