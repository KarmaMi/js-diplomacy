package diplomacy.variant.standard.rule

import scala.scalajs.js.annotation.{ JSExportDescendentObjects, JSExportAll }

@JSExportDescendentObjects @JSExportAll
trait Turn {
  val isBuildable: Boolean
  val isOccupationUpdateable: Boolean
}
