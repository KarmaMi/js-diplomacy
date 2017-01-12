package diplomacy.variant.standard.rule.mutable

import scala.collection.mutable
import scala.util.control.Breaks

import diplomacy.board.{ Power, DiplomacyMap }
import diplomacy.variant.standard.rule.{ Order, MilitaryBranch, Result }

final class MovementOrderGroup[Power_ <: Power](
  val target: MovementOrderWithResult[Power_],
  val relatedOrders: Set[MovementOrderWithResult[Power_]]
) extends DiplomacyMap.TypeHelper {
  type Power = Power_
  type MilitaryBranch = MilitaryBranch.MilitaryBranch

  def validSupports: Set[Order.Support[Power]] = {
    this.relatedOrders withFilter { order =>
      order.order match {
        case Order.Support(_, _) =>
          (order.result != Some(Result.Dislodged)) &&
          (order.result != Some(Result.Cut)) &&
          (order.result != Some(Result.NoCorrespondingOrder))
        case _ => false
      }
    } map { _.order } collect { case s@ Order.Support(_, _) => s }
  }

  def power: Int = 1 + this.validSupports.size

  case class Route(useConvoy: Boolean)
  def route(map: DiplomacyMap): Option[Route] = {
    this.target.order match {
      case t@Order.Move(_, _, _) =>
        def canMoveViaConvoy(
          unit: DiplomacyUnit, destination: Province, provinces: Set[Province]
        ): Boolean = {
          val provinceBuffer = mutable.Set() ++ provinces
          def dfs(current: Province): Boolean = {
            val b = new Breaks()
            var retval: Boolean = false
            b.breakable {
              map.movableProvincesOf(current, MilitaryBranch.Fleet) foreach { next =>
                if (next == destination) {
                  retval = true
                  b.break()
                } else if (provinceBuffer contains next) {
                  provinceBuffer -= next
                  if (dfs(next)) {
                    retval = true
                    b.break()
                  }
                }
              }
            }
            retval
          }

          val b = new Breaks()
          var retval: Boolean = false
          b.breakable {
            map.movableProvincesOf(unit.location.province, MilitaryBranch.Fleet) foreach { next =>
              if (provinceBuffer contains next) {
                provinceBuffer -= next
                if (dfs(next)) {
                  retval = true
                  b.break()
                }
              }
            }
          }
          retval
        }

        val provinces =
            this.relatedOrders withFilter { order =>
              order.order match {
                case Order.Convoy(_, _) =>
                  order.result match {
                    case Some(Result.Failed) | Some(Result.Success) => true
                    case _ => false
                  }
                case _ => false
              }
            } map { _.order.unit.location.province }
        if (canMoveViaConvoy(t.unit, t.destination.province, provinces.toSet)) {
          Option(Route(true))
        } else if (map.movableLocationsOf(t.unit) contains t.destination) {
          Option(Route(false))
        } else {
          None
        }
      case _ => None
    }
  }
}
