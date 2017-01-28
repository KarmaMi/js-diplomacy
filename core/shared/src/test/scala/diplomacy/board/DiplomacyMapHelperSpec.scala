package diplomacy.board

import diplomacy.UnitSpec
import diplomacy.mock.board._

class DiplomacyMapHelperSpec extends UnitSpec {
  "A DiplomacyMapHelper" should {
    "provide a way to get a power." in {
      val h = DiplomacyMapHelper(map)
      h.power.France should be (france)
    }
    "provide a way to get a location." in {
      val h = DiplomacyMapHelper(map)
      h.Mar should be (mar)
    }
    "provide a way to a military-branch." in {
      val h = DiplomacyMapHelper(map)
      h.militaryBranch.A should be (army)
    }
  }
  it when {
    "an invalid power is required." should {
      "throw an exception." in {
        val h = DiplomacyMapHelper(map)
        intercept[NoSuchElementException] {
          h.power.Russia
        }
      }
    }
    "an invalid location is required." should {
      "throw an exception." in {
        val h = DiplomacyMapHelper(map)
        intercept[NoSuchElementException] {
          h.Swe
        }
      }
    }
    "an invalid military-branch is required" should {
      "throw an exception." in {
        val h = DiplomacyMapHelper(map)
        intercept[NoSuchElementException] {
          h.militaryBranch.K
        }
      }
    }
  }
}
