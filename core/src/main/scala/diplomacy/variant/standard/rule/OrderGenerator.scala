package diplomacy.variant.standard.rule

import diplomacy.rule.InvalidOrderMessage

trait OrderGenerator extends Rule.TypeHelper {
  def ordersToSkipPhase(board: Board): Option[Set[Order]]
  def defaultOrder(board: Board)(unit: DiplomacyUnit): Order
}
