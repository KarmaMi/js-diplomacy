package diplomacy.variant.standard.rule

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

@JSExport @JSExportAll
final case class State [Turn_ <: Turn](turn: Turn_, phase: Phase)
