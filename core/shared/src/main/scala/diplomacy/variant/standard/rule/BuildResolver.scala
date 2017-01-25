package diplomacy.variant.standard.rule

import scala.collection.{ mutable => cmutable }

import diplomacy.rule.{ InvalidOrderMessage, OrderResult, ResolvedResult }
import diplomacy.variant.standard.rule.Keywords._

class BuildResolver extends Rule.TypeHelper {
  def apply(nextTurn: Turn => Turn)(
    board: Board, orders: Set[Order]
  ): Either[InvalidOrderMessage, ResolvedResult] = {
    val disbands = orders collect { case d@ Order.Disband(_) => d }
    val builds = orders collect { case b@ Order.Build(_) => b }

    val newUnits = board.units -- (disbands map { _.unit }) ++ (builds map { _.unit })
    val newState =
      board.state.copy(turn = nextTurn(board.state.turn), phase = Movement)

    val newBoard = board.copy(
      state = newState,
      units = newUnits,
      unitStatuses = Map[DiplomacyUnit, UnitStatus](),
      provinceStatuses = Map[Province, ProvinceStatus]()
    )
    val orderResults: Set[OrderResult] = ((disbands ++ builds) map {
      case order =>
        OrderResult.Executed[Power, MilitaryBranch, Order, Result](order, Result.Success)
    })(collection.breakOut)

    Right(ResolvedResult(newBoard, orderResults, false))
  }
}
