package diplomacy.board

import scala.scalajs.js.annotation.{ JSExportDescendentObjects, JSExportAll }

@JSExportDescendentObjects @JSExportAll
trait Power {
  val name: String
  override def toString: String = this.name
}
