package diplomacy.board

final case class Location[P <: Power, MB <: MilitaryBranch](
  province: Province[P], militaryBranches: Set[MB]
) {
  override def toString: String = this.province.toString
}

object Location {
  trait TypeHelper extends Province.TypeHelper {
    type MilitaryBranch <: diplomacy.board.MilitaryBranch
    type Location = diplomacy.board.Location[Power, MilitaryBranch]
  }
}
