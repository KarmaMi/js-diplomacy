package diplomacy.variant.standard.rule

import diplomacy.rule.InvalidOrderMessage
import diplomacy.board.Power

class BuildOrderGenerator[Turn_ <: Turn, Power_ <: Power] extends OrderGenerator[Turn_, Power_] {
  def ordersToSkipPhase(board: Board): Option[Set[Order]] = {
    if (board.map.powers forall { power =>
      val numOfUnits = board.units count { unit => unit.power == power }
      val numOfSupply = board.numberOfSupplyCenters.getOrElse(power, 0)

      (numOfUnits == numOfSupply) || (numOfSupply == 0)
    }) {
      Option(
        board.map.powers flatMap { power =>
          val numOfUnits = board.units count { unit => unit.power == power }
          val numOfSupply = board.numberOfSupplyCenters.getOrElse(power, 0)

          if (numOfSupply == 0) {
            board.units withFilter { unit => unit.power == power } map { unit =>
              Order.Disband(unit): Order
            }
          } else {
            Set[Order]()
          }
        }
      )
    } else {
      None
    }
  }
  def defaultOrder(board: Board)(unit: DiplomacyUnit): Order = ??? // TODO
}
