package diplomacy.variant.standard.rule

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.board.{ Name, Province }
import diplomacy.variant.standard.rule._
import diplomacy.variant.standard.rule.Keywords._

@JSExport @JSExportAll
object Keywords {
  /*  Military Branch */
  val Army = MilitaryBranch.Army
  val Fleet = MilitaryBranch.Fleet

  /* Phase */
  val Movement = Phase.Movement
  val Retreat = Phase.Retreat
  val Build = Phase.Build
}
