package diplomacy.board

import diplomacy.UnitSpec

class ProvinceSpec extends UnitSpec {
  "A province" when {
    "it is a supply-center" should {
      "add * to a return-value of #toString." in {
        val england = new Power { val name = "England" }
        val prov = Province(Name("Lvp"), Option(england), true)
        prov.toString should be("Lvp*")
      }
    }
  }
}
