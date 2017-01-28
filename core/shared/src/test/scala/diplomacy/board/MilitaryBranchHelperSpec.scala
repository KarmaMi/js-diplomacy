package diplomacy.board

import diplomacy.UnitSpec
import diplomacy.mock.board._

class MilitaryBranchHelperSpec extends UnitSpec {
  "A MilitaryBranchHelper" should {
    "provide a way to get a military-branch." in {
      val h = MilitaryBranchHelper(Set(army))
      h.A should be (army)
    }
  }
  it when {
    "an invalid military-branch is required." should {
      "throw an exception." in {
        val h = MilitaryBranchHelper(Set(army))
        intercept[NoSuchElementException] {
          h.F
        }
      }
    }
  }
}
