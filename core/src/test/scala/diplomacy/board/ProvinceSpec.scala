package diplomacy.board

import diplomacy.UnitSpec
import diplomacy.mock.board._

class ProvinceSpec extends UnitSpec {
  "A province" when {
    "it is a supply-center" should {
      "add * to a return-value of #toString." in {
        mar.toString should be("Mar*")
      }
    }
  }
}
