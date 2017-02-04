package diplomacy.board

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.util.JsConverters._

@JSExport @JSExportAll
final case class JsBoard[State_, Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, UnitStatus_, ProvinceStatus_](
  board: Board[State_, Power_, MilitaryBranch_, UnitStatus_, ProvinceStatus_]
) {
  val map = JsDiplomacyMap(board.map)
  val state = board.state
  val units = fromTraversable(board.units map { unit => JsDiplomacyUnit(unit) })
  def unitStatusOf(unit: JsDiplomacyUnit[Power_, MilitaryBranch_]) = {
    fromOption(board.unitStatuses.get(unit.unit))
  }
  def provinceStatusOf(province: JsProvince[Power_]) = {
    fromOption(board.provinceStatuses.get(province.province))
  }

  override def toString: String = s"JS ${board}"
}
