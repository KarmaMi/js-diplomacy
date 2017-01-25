package diplomacy.board

final case class DiplomacyUnit[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch](
  power: Power_, militaryBranch: MilitaryBranch_, location: Location[Power_, MilitaryBranch_]
) {
  require(location.militaryBranches contains militaryBranch)

  override def toString: String = s"${this.militaryBranch} ${this.location}"
}

object DiplomacyUnit {
  trait TypeHelper extends diplomacy.board.Location.TypeHelper {
    type DiplomacyUnit = diplomacy.board.DiplomacyUnit[Power, MilitaryBranch]
  }
}
