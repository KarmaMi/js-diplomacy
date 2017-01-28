package diplomacy.variant.standard.rule

import scala.scalajs.js.annotation.{ JSExportDescendentObjects, JSExportAll }

@JSExportDescendentObjects @JSExportAll
sealed abstract class ProvinceStatus(name: String) {
  override def toString: String = name
}

object ProvinceStatus {
  object Standoff extends ProvinceStatus("Standoff")
}
