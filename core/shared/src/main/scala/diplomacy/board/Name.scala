package diplomacy.board

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

@JSExport @JSExportAll
final case class Name(name: String, abbreviatedName: String) {
  def this(name: String) = this(name, name)

  override def toString: String = this.abbreviatedName
}

object Name {
  def apply(name: String): Name = Name(name, name)
}
