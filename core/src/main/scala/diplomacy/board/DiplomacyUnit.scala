package diplomacy.board

final case class DiplomacyUnit[P <: Power, MB <: MilitaryBranch](
  power: P, militaryBranch: MB, location: Location[P, MB]
) {
  require(location.militaryBranches contains militaryBranch)

  override def toString: String = s"${this.militaryBranch} ${this.location}"
}
