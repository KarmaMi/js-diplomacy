package diplomacy.board

import scala.scalajs.js.annotation.{ JSExportAll, JSExportDescendentObjects }

@JSExportDescendentObjects @JSExportAll
trait MilitaryBranch {
  val name: Name
  override def toString: String = this.name.toString
}
