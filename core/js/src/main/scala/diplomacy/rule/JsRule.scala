package diplomacy.rule

import scala.scalajs.js
import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.board.{ Power, MilitaryBranch, JsBoard }
import diplomacy.util.JsConverters._

@JSExport @JSExportAll
final class JsRule[State_, Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, UnitStatus_, ProvinceStatus_, Order_ <: Order[Power_, MilitaryBranch_], Result_](
  val rule: Rule[State_, Power_, MilitaryBranch_, UnitStatus_, ProvinceStatus_, Order_, Result_]
) {
  def resolve(
    board: JsBoard[State_, Power_, MilitaryBranch_, UnitStatus_, ProvinceStatus_],
    orders: js.Array[JsOrder[Order_]]
  ) = {
    this.rule.resolve(board.board, toSet(orders) map { _.order }) match {
      case Left(v1) =>
        JsRule.Result(fromOption(Option(v1)), fromOption(None))
      case Right(v2) =>
        JsRule.Result(fromOption(None), fromOption(Option(JsResolvedResult(v2))))
    }
  }
}

object JsRule {
  @JSExport("diplomacy.rule.inner.Result") @JSExportAll
  case class Result[State_, Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, UnitStatus_, ProvinceStatus_, Order_ <: Order[Power_, MilitaryBranch_], Result_](
    err: js.UndefOr[InvalidOrderMessage],
    result: js.UndefOr[JsResolvedResult[State_, Power_, MilitaryBranch_, UnitStatus_, ProvinceStatus_, Order_, Result_]])
}
