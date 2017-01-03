package diplomacy.board

final case class Location[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch](
  province: Province[Power_], militaryBranches: Set[MilitaryBranch_]
) {
  override def toString: String = this.province.toString
}

object Location {
  trait TypeHelper extends Province.TypeHelper {
    type MilitaryBranch <: diplomacy.board.MilitaryBranch
    type Location = diplomacy.board.Location[Power, MilitaryBranch]
  }
}
