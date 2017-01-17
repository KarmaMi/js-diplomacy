package diplomacy.variant.standard.rule

import scala.collection.{ mutable => cmutable }

import diplomacy.rule.InvalidOrderMessage
import diplomacy.board.Power

class BuildValidator[Turn_ <: Turn, Power_ <: Power] extends Validator[Turn_, Power_] {
  def unitsRequiringOrder(board: Board): Set[DiplomacyUnit] = Set()

  def errorMessageOfOrder(board: Board)(order: Order): Option[InvalidOrderMessage] = {
    order match {
      case Order.Build(unit) =>
        if (board.units exists { _.location.province == unit.location.province }) {
          Option(InvalidOrderMessage(s"An unit is in ${unit.location.province.name}."))
        } else if (unit.location.province.homeOf != Option(unit.power)) {
          Option(InvalidOrderMessage(s"${unit.power} cannot build an unit in ${unit.location}."))
        } else if (!unit.location.province.isSupplyCenter) {
          Option(InvalidOrderMessage(s"${unit.location.province.name} is not supply center."))
        } else if (board.occupation.get(unit.location.province) != Some(unit.power)) {
          Option(
            InvalidOrderMessage(s"${unit.location.province.name} is not occupied by ${unit.power}.")
          )
        } else {
          None
        }
      case Order.Disband(unit) =>
        if (!(board.units contains unit)) {
          Option(InvalidOrderMessage(s"${unit} does not exist."))
        } else {
          val numOfUnits = board.units count { _.power == unit.power }
          val numOfSupplys = board.numberOfSupplyCenters.getOrElse(unit.power, 0)
          if (numOfUnits <= numOfSupplys) {
            Option(InvalidOrderMessage(s"${unit.power} has sufficient supply centers."))
          } else {
            None
          }
        }
      case _ => Option(InvalidOrderMessage(s"${order} is not order for build phase."))
    }
  }
  def errorMessageOfOrders(board: Board)(orders: Set[Order]): Option[InvalidOrderMessage] = {
    board.map.powers find { power =>
      val numOfUnits = board.units count { unit => power == unit.power }
      val numOfSupplys = board.numberOfSupplyCenters.getOrElse(power, 0)

      val diff = (orders map {
        case Order.Build(unit) if unit.power == power => 1
        case Order.Disband(unit) if unit.power == power => -1
        case _ => 0
      }).sum

      (numOfUnits + diff) > numOfSupplys
    } map { power => InvalidOrderMessage(s"${power} does not have enough supply centers.") }
  }
}
