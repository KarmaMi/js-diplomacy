package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board.Province
import diplomacy.variant.standard.board.Keywords._
import diplomacy.variant.standard.board.Implicits._
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map.Power
import diplomacy.variant.standard.map.Keywords._
import diplomacy.variant.standard.rule.Keywords._
import diplomacy.variant.standard.rule.Implicits._

class StandardRuleUtilsSpec extends UnitSpec {
  "A StandardRuleUtils" can {
    "calculate the number of supply centers for each power." in {
      val board = new Board(
        map.map, 1901.Spring - Movement, Set[DiplomacyUnit[Power]](),
        Map[DiplomacyUnit[Power], UnitStatus[Power]](),
        Map[Province[Power], ProvinceStatus[Power]](
          Mar.province -> ProvinceStatus(Option(France), false),
          Spa.province -> ProvinceStatus(Option(France), false)
        )
      )
      StandardRuleUtils.numberOfSupplyCenters(board) should be(Map(France -> 2))
    }
  }
}
