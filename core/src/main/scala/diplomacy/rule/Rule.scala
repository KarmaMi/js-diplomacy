package diplomacy.rule

import scala.collection.mutable

import diplomacy.board.Board
import diplomacy.board.{ Power, MilitaryBranch }

trait Rule[Status_, Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, UnitStatus_, ProvinceStatus_, Order_ <: Order[Power_, MilitaryBranch_], Result_] extends Rule.TypeHelper {
  type Power = Power_
  type MilitaryBranch = MilitaryBranch_
  type State = Status_
  type UnitStatus = UnitStatus_
  type ProvinceStatus = ProvinceStatus_
  type Order = Order_
  type Result = Result_

  def resolve(board: Board, orders: Set[Order]): Either[InvalidOrderMessage, ResolvedResult] = {
    // Reject if one unit has several orders
    val unitsHaveSeveralOrders =
      orders withFilter {
        order1 => (orders - order1) exists { order2 => order1.unit == order2.unit }
      } map { order => order.unit }
    if (unitsHaveSeveralOrders.nonEmpty) {
      Left(InvalidOrderMessage(s"${unitsHaveSeveralOrders mkString ", "}: several orders."))
    } else {
      val os = mutable.Map[DiplomacyUnit, Order]() ++ (orders map { order => order.unit -> order })

      // Add a default orders if an unit requiring an order has no order
      this.unitsRequiringOrder(board) foreach { unit =>
        if (!(os contains unit)) {
          os(unit) = this.defaultOrderOf(board)(unit)
        }
      }

      // Replace from invalid orders to default orders
      val replaced =
        os flatMap {
          case (unit, order) =>
            this.errorMessageOfOrder(board)(order) map { message => unit -> (order, message) }
        }
      replaced foreach { case (unit, _) => os(unit) = this.defaultOrderOf(board)(unit) }

      this.errorMessageOfOrders(board)(os.values.toSet) match {
        // Reject if the set of the orders is invalid
        case Some(message) => Left(message)
        case None =>
          this.resolveProcedure(board, os.values.toSet).right map {
            case r @ ResolvedResult(board, result) =>
              val newResult = mutable.Map() ++ (result map { r => r.target.unit -> r })
              replaced foreach {
                case (unit, (order, message)) =>
                  val resultOfUnit = newResult(unit)
                  newResult(unit) =
                    OrderResult.Replaced(order, message, resultOfUnit.target, resultOfUnit.result)
              }
              r.copy(result = newResult.values.toSet)
          }
      }
    }
  }

  protected[this] def resolveProcedure(
    board: Board, orders: Set[Order]
  ): Either[InvalidOrderMessage, ResolvedResult]

  protected[this] def unitsRequiringOrder(board: Board): Set[DiplomacyUnit]

  protected[this] def errorMessageOfOrder(board: Board)(
    order: Order
  ): Option[InvalidOrderMessage]
  protected[this] def errorMessageOfOrders(board: Board)(order: Set[Order]
  ): Option[InvalidOrderMessage]

  protected[this] def defaultOrderOf(board: Board)(unit: DiplomacyUnit): Order
}

object Rule {
  trait TypeHelper extends Board.TypeHelper {
    type Order <: diplomacy.rule.Order[Power, MilitaryBranch]
    type Result
    type ResolvedResult =
      diplomacy.rule.ResolvedResult[State, Power, MilitaryBranch, UnitStatus, ProvinceStatus, Order, Result]
    type Rule =
      diplomacy.rule.Rule[State, Power, MilitaryBranch, UnitStatus, ProvinceStatus, Order, Result]
  }
}
