package diplomacy.rule

import scala.scalajs.js.annotation.{ JSExportDescendentObjects, JSExportAll }

import diplomacy.board.{ Power, MilitaryBranch, JsDiplomacyUnit }

@JSExportDescendentObjects @JSExportAll
trait JsOrder[Order_ <: Order[_ <: Power, _ <: MilitaryBranch]] {
  val order: Order_
  val unit = JsDiplomacyUnit(order.unit)
}
