package diplomacy.variant

import diplomacy.board.{ DiplomacyUnit, Province }
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._
import diplomacy.variant.standard.board
import diplomacy.variant.standard.board._
import diplomacy.variant.standard.rule._

package object standard {
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
      occupation = (map.map.provinces collect {
        case p@ Province(_, Some(home), _) => p -> home
      }).toMap,
      Map(),
      Map()
  )

  private[this] val rule = new Rule[board.Turn, map.Power](board.Turn.nextTurn)

  val variant = Variant(rule, initialBoard)
}
