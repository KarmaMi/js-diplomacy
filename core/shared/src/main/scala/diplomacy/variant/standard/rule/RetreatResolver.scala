package diplomacy.variant.standard.rule

import scala.collection.{ mutable => cmutable }

import diplomacy.board.{ DiplomacyUnit => BaseDiplomacyUnit }
import diplomacy.rule.{ InvalidOrderMessage, OrderResult, ResolvedResult }
import diplomacy.variant.standard.rule.Keywords._

class RetreatResolver extends Rule.TypeHelper {
  def apply(nextTurn: Turn => Turn)(
    board: Board, orders: Set[Order]
  ): Either[InvalidOrderMessage, ResolvedResult] = {
    val disbands = orders collect { case d@ Order.Disband(_) => d }
    val retreats = orders collect { case r@ Order.Retreat(_, _) => r }

    val results = cmutable.Map[Order, Result]()

    // Resolve disband orders
    disbands foreach { order => results(order) = Result.Success }

    // Create a map from province to retreat order
    val province2Retreats = (retreats groupBy { _.destination.province }).toMap

    // Resolve retreat orders
    province2Retreats foreach {
      case (province, retreats) if retreats.size == 1 =>
        retreats foreach { r => results(r) = Result.Success }
      case (province, retreats) if retreats.size != 1 =>
        retreats foreach { r => results(r) = Result.Failed }
    }


    // Generate a new board
    val unit2Result = results map { case (order, result) => order.unit -> (order, result) }
    val newUnits = board.units flatMap { unit =>
      unit2Result.get(unit) match {
        case Some((Order.Disband(_), Result.Success)) => None
        case Some((Order.Retreat(_, destination), Result.Success)) =>
          Option(unit.copy(location = destination))
        case Some((Order.Retreat(_, _), Result.Failed)) => None
        case _ => Option(unit)
      }
    }

    // Update occupation if needed
    val newState =
      if (board.state.turn.isBuildable) {
        board.state.copy(phase = Build)
      } else {
        board.state.copy(
          turn = nextTurn(board.state.turn),
          phase = Movement
        )
      }
    val occupationStatuses = board.provinceStatuses filter { _._2.occupied.isDefined }
    val newProvinceStatuses: Map[Province, ProvinceStatus] =
      if (board.state.turn.isOccupationUpdateable) {
        occupationStatuses ++ (newUnits map {
          case BaseDiplomacyUnit(power, _, location) =>
            location.province -> ProvinceStatus[Power](Option(power), false)
        })
      } else {
        occupationStatuses
      }

    val newBoard = board.copy(
      state = newState,
      units = newUnits,
      unitStatuses = Map[DiplomacyUnit, UnitStatus](),
      provinceStatuses = newProvinceStatuses
    )
    val orderResults: Set[OrderResult] = (results map {
      case (order, result) =>
        OrderResult.Executed[Power, MilitaryBranch, Order, Result](order, result)
    })(collection.breakOut)

    val numOfCenters = board.map.provinces count { _.isSupplyCenter }
    val numberOfSupplyCenters = StandardRuleUtils.numberOfSupplyCenters(board)
    val isFinished =
      board.map.powers exists { power =>
        numberOfSupplyCenters.getOrElse(power, 0) > (numOfCenters / 2)
      }
    Right(ResolvedResult(newBoard, orderResults, isFinished))
  }
}
