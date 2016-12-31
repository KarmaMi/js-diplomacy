package diplomacy.board

final case class Board[State, P <: Power, MB <: MilitaryBranch, UnitStatus, ProvinceStatus](
  state: State, units: Map[P, Set[DiplomacyUnit[P, MB]]], occupation: Map[P, Set[Province[P]]],
  unitStatuses: Map[P, Map[DiplomacyUnit[P, MB], UnitStatus]],
  provinceStatuses: Map[Province[P], ProvinceStatus]
) {
  val numberOfSupplyCenters: Map[P, Int] = occupation map {
    case (power, provinces) => power -> provinces.count(province => province.isSupplyCenter)
  }

  override def toString: String = state.toString
}
