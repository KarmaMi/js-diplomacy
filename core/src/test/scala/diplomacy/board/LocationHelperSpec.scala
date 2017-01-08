package diplomacy.board

import diplomacy.UnitSpec
import diplomacy.mock.board._

class LocationHelperSpec extends UnitSpec {
  "A LocationHelper" should {
    "provide a way to get a location." in {
      val h = LocationHelper(Set(mar))
      h.Mar should be (mar)
    }
  }
  it when {
    "an invalid location is required." should {
      "throw an exception." in {
        val h = LocationHelper(Set(mar))
        intercept[NoSuchElementException] {
          h.Swe
        }
      }
    }
  }
}
