package diplomacy.board

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

@JSExport @JSExportAll
final case class Board[State_, Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, UnitStatus_, ProvinceStatus_](
  map: DiplomacyMap[Power_, MilitaryBranch_],
  state: State_,
  units: Set[DiplomacyUnit[Power_, MilitaryBranch_]],
  unitStatuses: Map[DiplomacyUnit[Power_, MilitaryBranch_], UnitStatus_],
  provinceStatuses: Map[Province[Power_], ProvinceStatus_]
) {
  override def toString: String = {
    s"${this.state}(${this.units}, ${this.unitStatuses}, ${this.provinceStatuses})"
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
