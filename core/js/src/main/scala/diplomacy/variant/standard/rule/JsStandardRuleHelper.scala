package diplomacy.variant.standard.rule

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.board.{ DiplomacyUnit => BaseDiplomacyUnit, Power, JsBoard }
import diplomacy.variant.standard.rule.Keywords._

@JSExport @JSExportAll
class JsStandardRuleHelper[Turn_ <: Turn, Power_ <: Power] (
  board: JsBoard[State[Turn_], Power_, MilitaryBranch, UnitStatus[Power_], ProvinceStatus[Power_]]
) extends Rule.TypeHelper {
  final type Turn = Turn_
  final type Power = Power_

  def A(location: Location): JsStandardDiplomacyUnit[Power] = {
    new JsStandardDiplomacyUnit(this.unit(Army)(location))
  }
  def F(location: Location): JsStandardDiplomacyUnit[Power] = {
    new JsStandardDiplomacyUnit(this.unit(Fleet)(location))
  }

  private[this] def unit(militaryBranch: MilitaryBranch)(location: Location): DiplomacyUnit = {
    def getUnit(units: Set[DiplomacyUnit]): Option[DiplomacyUnit] = {
      units find { unit => unit.location == location && unit.militaryBranch == militaryBranch }
    }

    this.board.board.state.phase match {
      case Phase.Movement =>
        getUnit(this.board.board.units).get
      case Phase.Retreat =>
        getUnit(
          this.board.board.units filter { unit =>
            this.board.board.unitStatuses.get(unit) match {
              case Some(UnitStatus.Dislodged(_)) => true
              case _ => false
            }
          }
        ).get
      case Phase.Build =>
        getUnit(this.board.board.units) match {
          case Some(unit) => unit
          case None =>
            require(location.province.homeOf.isDefined)
            location.province.homeOf match {
              case Some(home) => BaseDiplomacyUnit(home, militaryBranch, location)
              case _ => ???
            }
        }
    }
  }
}
