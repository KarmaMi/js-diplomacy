package diplomacy.rule

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.board.{ Power, MilitaryBranch, JsBoard }
import diplomacy.util.JsConverters._

@JSExport @JSExportAll
final case class JsResolvedResult[State_, Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, UnitStatus_, ProvinceStatus_, Order_ <: Order[Power_, MilitaryBranch_], Result_](
  resolvedResult: ResolvedResult[State_, Power_, MilitaryBranch_, UnitStatus_, ProvinceStatus_, Order_, Result_]
) {
  val board = JsBoard(resolvedResult.board)
  val result = fromTraversable(resolvedResult.result)
  val isFinished = resolvedResult.isFinished
}
