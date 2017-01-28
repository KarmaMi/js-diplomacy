package diplomacy.board

import diplomacy.UnitSpec
import diplomacy.mock.board._
import diplomacy.mock.board.{ Board => MockBoard }

class BoardSpec extends UnitSpec {
  "A board" should {
    "calculate the number of supply centers for each power." in {
      val board =
        new MockBoard(map, "State", Set(), Map(marP -> france, spaP -> france), Map(), Map())
      board.numberOfSupplyCenters should be(Map(france -> 2))
    }
  }
}
