package diplomacy.board

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.util.JsConverters._

@JSExport @JSExportAll
final case class JsLocation[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch](
  location: Location[Power_, MilitaryBranch_]
) {
  val name = location.name
  val province = JsProvince(location.province)
  val militaryBranches = fromTraversable(location.militaryBranches)
  override def toString: String = s"JS ${location}"
}
