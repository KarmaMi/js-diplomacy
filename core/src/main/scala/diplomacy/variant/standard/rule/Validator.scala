package diplomacy.variant.standard.rule

import diplomacy.rule.InvalidOrderMessage
import diplomacy.board.Power

trait Validator[Turn_ <: Turn, Power_ <: Power] extends Rule.TypeHelper {
  final type Turn = Turn_
  final type Power = Power_

  def unitsRequiringOrder(board: Board): Set[DiplomacyUnit]

  def errorMessageOfOrder(board: Board)(order: Order): Option[InvalidOrderMessage]
  def errorMessageOfOrders(board: Board)(order: Set[Order]): Option[InvalidOrderMessage]
}
