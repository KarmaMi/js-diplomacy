package diplomacy.variant.standard.board

import scala.scalajs.js.annotation.JSExportDescendentObjects

@JSExportDescendentObjects
sealed abstract class Season(name: String) {
  override def toString: String = name
}

object Season {
  object Spring extends Season("Spring")
  object Autumn extends Season("Autumn")
}
