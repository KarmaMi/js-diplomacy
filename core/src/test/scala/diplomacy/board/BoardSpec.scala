package diplomacy.board

import diplomacy.UnitSpec
import diplomacy.util.LabeledUndirectedGraph

class BoardSpec extends UnitSpec {
  "A board" should {
    "calculate the number of supply centers for each power." in {
      val fleet = new MilitaryBranch { val name = Name("Fleet", "F") }
      val army = new MilitaryBranch { val name = Name("Army", "A") }

      val france = new Power { val name = "France" }

      val marP = Province[Power](Name("Mar"), Option(france), true)
      val mar = Location(marP, Set(army, fleet))

      val spaP = Province[Power](Name("Spa"), None, true)
      val spa = Location(spaP, Set(army))

      val map = DiplomacyMap(
        LabeledUndirectedGraph(
          Set(mar, spa),
          Set((mar -> spa, Set(army)))
        )
      )

      val board = Board[String, Power, MilitaryBranch, String, String](
        map, "State", Set(), Map(france -> Set(marP, spaP)), Map(), Map()
      )
      board.numberOfSupplyCenters should be(Map(france -> 2))
    }
  }
}
