package diplomacy.variant

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.board._
import diplomacy.rule.{ Order, JsRule }

@JSExport @JSExportAll
final case class JsVariant[State_, Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, UnitStatus_, ProvinceStatus_, Order_ <: Order[Power_, MilitaryBranch_], Result_](
  variant: Variant[State_, Power_, MilitaryBranch_, UnitStatus_, ProvinceStatus_, Order_, Result_]
) {
  val rule = new JsRule(variant.rule)
  val initialBoard = JsBoard(variant.initialBoard)
}
