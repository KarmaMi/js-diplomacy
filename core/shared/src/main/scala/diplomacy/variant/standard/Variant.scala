package diplomacy.variant.standard

import scala.scalajs.js.annotation.JSExport

import diplomacy.board.{ DiplomacyUnit, Province }
import diplomacy.variant.{ Variant => BaseVariant }
import diplomacy.variant.standard.map.Power
import diplomacy.variant.standard.map.Keywords._
import diplomacy.variant.standard.board.Keywords._
import diplomacy.variant.standard.board.Implicits._
import diplomacy.variant.standard.rule.{ Rule, Board, ProvinceStatus }
import diplomacy.variant.standard.rule.Keywords._
import diplomacy.variant.standard.rule.Implicits._

@JSExport
object Variant {
  private[this] val initialBoard =
    new Board[board.Turn, Power](
      map.map,
      1901.Spring - Movement,
      units = Set(
        DiplomacyUnit(Austria, Army, Vie), DiplomacyUnit(Austria, Army, Bud), DiplomacyUnit(Austria, Fleet, Tri),
        DiplomacyUnit(England, Army, Lvp), DiplomacyUnit(England, Fleet, Edi), DiplomacyUnit(England, Fleet, Lon),
        DiplomacyUnit(France, Army, Mar),  DiplomacyUnit(France, Army, Par),  DiplomacyUnit(France, Fleet, Bre),
        DiplomacyUnit(Germany, Army, Ber), DiplomacyUnit(Germany, Army, Mun), DiplomacyUnit(Germany, Fleet, Kie),
        DiplomacyUnit(Italy, Army, Ven),   DiplomacyUnit(Italy, Army, Rom),   DiplomacyUnit(Italy, Fleet, Nap),
        DiplomacyUnit(Russia, Army, Mos),  DiplomacyUnit(Russia, Army, War),
        DiplomacyUnit(Russia, Fleet, Sev), DiplomacyUnit(Russia, Fleet, StP_SC),
        DiplomacyUnit(Turkey, Army, Smy),  DiplomacyUnit(Turkey, Army, Con),  DiplomacyUnit(Turkey, Fleet, Ank)
      ),
      Map(),
      provinceStatuses = (map.map.provinces collect {
        case p@ Province(_, Some(home), _) => p -> ProvinceStatus[Power](Option(home), false)
      }).toMap
  )

  private[this] val rule = new Rule[board.Turn, map.Power](board.Turn.nextTurn)

  @JSExport
  val variant = BaseVariant(rule, initialBoard)
}
