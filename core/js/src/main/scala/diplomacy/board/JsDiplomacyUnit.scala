package diplomacy.board

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

@JSExport @JSExportAll
final case class JsDiplomacyUnit[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch](
  unit: DiplomacyUnit[Power_, MilitaryBranch_]
) {
  val power = unit.power
  val militaryBranch = unit.militaryBranch
  val location = JsLocation(unit.location)
  override def toString: String = s"JS ${unit}"
}
