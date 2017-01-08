package diplomacy.variant.standard.rule

import diplomacy.rule.InvalidOrderMessage

trait Validator extends Rule.TypeHelper {
  def unitsRequiringOrder(board: Board): Set[DiplomacyUnit]

  def errorMessageOfOrder(board: Board)(order: Order): Option[InvalidOrderMessage]
  def errorMessageOfOrders(board: Board)(order: Set[Order]): Option[InvalidOrderMessage]
}
