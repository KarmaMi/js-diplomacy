package diplomacy.board

import diplomacy.UnitSpec
import diplomacy.mock.board._

class DiplomacyUnitSpec extends UnitSpec {
  "A diplomacy-unit" should {
    "add its location and military-branch to a return-value of #toString." in {
      val unit = DiplomacyUnit(france, fleet, apu)
      unit.toString should be ("F Apu")
    }
  }
}
