package diplomacy.variant.standard.rule

import diplomacy.rule.InvalidOrderMessage
import diplomacy.board.Power

trait OrderGenerator[Turn_ <: Turn, Power_ <: Power] extends Rule.TypeHelper {
  final type Turn = Turn_
  final type Power = Power_

  def ordersToSkipPhase(board: Board): Option[Set[Order]]
  def defaultOrder(board: Board)(unit: DiplomacyUnit): Order
}
