package diplomacy.board

import diplomacy.UnitSpec
import diplomacy.mock.board._

class PowerHelperSpec extends UnitSpec {
  "A PowerHelper" should {
    "provide a way to get a location." in {
      val h = PowerHelper(Set(france))
      h.France should be (france)
    }
  }
  it when {
    "an invalid power is required." should {
      "throw an exception." in {
        val h = PowerHelper(Set(france))
        intercept[NoSuchElementException] {
          h.Russia
        }
      }
    }
  }
}
