package diplomacy.board

import scala.scalajs.js.annotation.{ JSExportAll, JSExport }

@JSExport @JSExportAll
final case class Location[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch](
  name: Name, province: Province[Power_], militaryBranches: Set[MilitaryBranch_]
) {
  def this(province: Province[Power_], militaryBranches: Set[MilitaryBranch_]) {
    this(province.name, province, militaryBranches)
  }
  override def toString: String = this.name.toString
}

object Location {
  def apply[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch](
    province: Province[Power_], militaryBranches: Set[MilitaryBranch_]
  ): Location[Power_, MilitaryBranch_] = this.apply(province.name, province, militaryBranches)

  trait TypeHelper extends Province.TypeHelper {
    type MilitaryBranch <: diplomacy.board.MilitaryBranch
    type Location = diplomacy.board.Location[Power, MilitaryBranch]
  }
}
