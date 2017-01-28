package diplomacy.variant.standard.rule

import scala.scalajs.js.annotation.{ JSExportAll, JSExportDescendentObjects }

@JSExportDescendentObjects @JSExportAll
sealed abstract class Phase(name: String) {
  override def toString: String = name
}

object Phase {
  object Movement extends Phase("Movement")
  object Retreat extends Phase("Retreat")
  object Build extends Phase("Build")
}
