package diplomacy.mock.rule

import diplomacy.rule.{ InvalidOrderMessage }
import diplomacy.mock.board.{ MockPower, MockMilitaryBranch }

abstract class MockRule extends Rule {

  protected[this] def resolveProcedure(
    board: Board, orders: Set[Order]
  ): Either[InvalidOrderMessage, ResolvedResult] = ???

  protected[this] def unitsRequiringOrder(board: Board): Set[DiplomacyUnit] = Set()

  protected[this] def errorMessageOfOrder(board: Board)(
    order: Order
  ): Option[InvalidOrderMessage] = None
  protected[this] def errorMessageOfOrders(board: Board)(
    order: Set[Order]
  ): Option[InvalidOrderMessage] = None

  protected[this] def defaultOrderOf(board: Board)(unit: DiplomacyUnit): Order = ???
}
