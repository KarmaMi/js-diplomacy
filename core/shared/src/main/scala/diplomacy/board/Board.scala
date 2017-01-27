package diplomacy.board

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

@JSExport @JSExportAll
final case class Board[State_, Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, UnitStatus_, ProvinceStatus_](
  map: DiplomacyMap[Power_, MilitaryBranch_],
  state: State_,
  units: Set[DiplomacyUnit[Power_, MilitaryBranch_]],
  occupation: Map[Province[Power_], Power_],
  unitStatuses: Map[DiplomacyUnit[Power_, MilitaryBranch_], UnitStatus_],
  provinceStatuses: Map[Province[Power_], ProvinceStatus_]
) {
  val numberOfSupplyCenters: Map[Power_, Int] =
    this.occupation groupBy { _._2 } map {
      case (power, provinces) =>
        power -> (provinces.count { case (province, _) => province.isSupplyCenter })
    }

  override def toString: String = {
    s"${this.state}(${this.units}, ${this.occupation}, ${this.unitStatuses}, ${this.provinceStatuses})"
  }
}

object Board {
  trait TypeHelper extends DiplomacyMap.TypeHelper {
    type State
    type UnitStatus
    type ProvinceStatus
    type Board = diplomacy.board.Board[State, Power, MilitaryBranch, UnitStatus, ProvinceStatus]
  }
}
