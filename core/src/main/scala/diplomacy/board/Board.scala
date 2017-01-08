package diplomacy.board

final case class Board[State_, Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, UnitStatus_, ProvinceStatus_](
  map: DiplomacyMap[Power_, MilitaryBranch_],
  state: State_, units: Set[DiplomacyUnit[Power_, MilitaryBranch_]],
  occupation: Map[Power_, Set[Province[Power_]]],
  unitStatuses: Map[DiplomacyUnit[Power_, MilitaryBranch_], UnitStatus_],
  provinceStatuses: Map[Province[Power_], ProvinceStatus_]
) {
  val numberOfSupplyCenters: Map[Power_, Int] = this.occupation map {
    case (power, provinces) => power -> provinces.count(province => province.isSupplyCenter)
  }

  override def toString: String = this.state.toString
}

object Board {
  trait TypeHelper extends DiplomacyMap.TypeHelper {
    type State
    type UnitStatus
    type ProvinceStatus
    type Board = diplomacy.board.Board[State, Power, MilitaryBranch, UnitStatus, ProvinceStatus]
  }
}
