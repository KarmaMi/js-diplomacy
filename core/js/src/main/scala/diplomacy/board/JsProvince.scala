package diplomacy.board

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.util.JsConverters._

@JSExport @JSExportAll
final case class JsProvince[Power_ <: Power](province: Province[Power_]) {
  val name = province.name
  val homeOf = fromOption(province.homeOf)
  val isSupplyCenter = province.isSupplyCenter
  override def toString: String = s"JS ${province}"
}
