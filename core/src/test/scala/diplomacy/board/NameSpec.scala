package diplomacy.board

import diplomacy.UnitSpec

class NameSpec extends UnitSpec {
  "A Name" should {
    "be stringify using its abbriviated name." in {
      val eng = Name("English Channel", "Eng")
      eng.toString should be("Eng")
    }
  }
  it when {
    "created" can {
      "omit an abbriviated name." in {
        val swe = Name("Sweden")
        swe.toString should be("Sweden")
      }
    }
  }
}
