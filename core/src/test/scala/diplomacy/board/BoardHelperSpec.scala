package diplomacy.board

import diplomacy.UnitSpec
import diplomacy.mock.board._
import diplomacy.mock.board.{ Board => MockBoard }

class BoardHelperSpec extends UnitSpec {
  "A BoardHelper" should {
    "provide a way to get diplomacy-unit." in {
      val board = new MockBoard(
        map, "State", Set(DiplomacyUnit(france, army, mar)), Map(), Map(), Map()
      )
      val h = BoardHelper(board)
      import h._
      h.A(h.Mar) should be (DiplomacyUnit(france, army, mar))
    }
  }
  it when {
    "an invalid unit is required" should {
      "throw an exception." in {
        val board = new MockBoard(
          map, "State", Set(DiplomacyUnit(france, army, spa)), Map(), Map(), Map()
        )
        val h = BoardHelper(board)
        import h._
        intercept[NoSuchElementException] {
          h.F(h.Spa)
        }
      }
    }
  }
}
