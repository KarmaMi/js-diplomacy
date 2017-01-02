package diplomacy.board

import diplomacy.UnitSpec
import diplomacy.util.LabeledUndirectedGraph
import diplomacy.mock.board._
import diplomacy.mock.board.{ Power => MockPower, MilitaryBranch => MockMilitaryBranch }

class BoardSpec extends UnitSpec {
  "A board" should {
    "calculate the number of supply centers for each power." in {
      val board = Board[String, MockPower, MockMilitaryBranch, String, String](
        map, "State", Set(), Map(france -> Set(marP, spaP)), Map(), Map()
      )
      board.numberOfSupplyCenters should be(Map(france -> 2))
    }
  }
  "A helper of Board classes" should {
    "provide fields for military-branches." in {
      val board = Board[String, MockPower, MockMilitaryBranch, String, String](
        map, "State", Set(DiplomacyUnit(france, army, spa)), Map(france -> Set(marP, spaP)),
        Map(), Map()
      )
      val helper = new Board.Helper(board)
      helper.A should be (army)
    }
    "provide a way to get diplomacy-unit." in {
      val board = Board[String, MockPower, MockMilitaryBranch, String, String](
        map, "State", Set(DiplomacyUnit(france, army, spa)), Map(france -> Set(marP, spaP)),
        Map(), Map()
      )
      val helper = new Board.Helper(board)
      helper.A("Spa") should be (DiplomacyUnit(france, army, spa))
    }
  }
  it when {
    "an invalid military-branch is required" should {
      "throw an exception." in {
        val board = Board[String, MockPower, MockMilitaryBranch, String, String](
          map, "State", Set(DiplomacyUnit(france, army, spa)), Map(france -> Set(marP, spaP)),
          Map(), Map()
        )
        val helper = new Board.Helper(board)
        intercept[NoSuchElementException](helper.K)
      }
    }
    "an invalid unit is required" should {
      "throw an exception." in {
        val board = Board[String, MockPower, MockMilitaryBranch, String, String](
          map, "State", Set(DiplomacyUnit(france, army, spa)), Map(france -> Set(marP, spaP)),
          Map(), Map()
        )
        val helper = new Board.Helper(board)
        intercept[NoSuchElementException](helper.F("Spa"))
      }
    }
  }
}
