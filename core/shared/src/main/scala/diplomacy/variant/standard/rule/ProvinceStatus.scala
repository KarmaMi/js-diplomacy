package diplomacy.variant.standard.rule

import scala.scalajs.js.annotation.{ JSExportDescendentObjects, JSExportAll }

import diplomacy.board.Power

@JSExportAll
final case class ProvinceStatus[Power_ <:Power](occupied: Option[Power_], standoff: Boolean)
