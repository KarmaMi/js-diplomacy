package diplomacy.board

import diplomacy.UnitSpec

class DiplomacyUnitSpec extends UnitSpec {
  "A diplomacy-unit" should {
    "add its location and military-branch to a return-value of #toString." in {
      val russia = new Power { val name = "Russia" }
      val fleet = new MilitaryBranch { val name = Name("F") }
      val bot = Province[Power](Name("Bot"), None, false)
      val unit = DiplomacyUnit(russia, fleet, Location(bot, Set(fleet)))
      unit.toString should be ("F Bot")
    }
  }
}
