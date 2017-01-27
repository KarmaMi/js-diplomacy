package diplomacy.variant.standard.rule

import scala.scalajs.js.annotation.{ JSExport, JSExportDescendentObjects }

@JSExport
object Phase {
  @JSExportDescendentObjects
  sealed abstract class Phase(name: String) {
    override def toString: String = name
  }
  object Movement extends Phase("Movement")
  object Retreat extends Phase("Retreat")
  object Build extends Phase("Build")
}
