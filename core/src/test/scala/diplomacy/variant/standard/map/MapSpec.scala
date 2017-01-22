package diplomacy.variant.standard.map

import diplomacy.UnitSpec
import diplomacy.variant.standard.rule._
import diplomacy.variant.standard.map.Keywords._
import diplomacy.variant.standard.rule.Keywords._

class MapSpec extends UnitSpec {
  "A map instance" should {
    "define provinces (1)" in {
      Pic.province.isSupplyCenter should be(false)
      Pic.province.homeOf should be(Option(France))

      Bre.province.isSupplyCenter should be(true)
      Bre.province.homeOf should be(Option(France))

      Bur.province.isSupplyCenter should be(false)
      Bur.province.homeOf should be(Option(France))

      Gas.province.isSupplyCenter should be(false)
      Gas.province.homeOf should be(Option(France))

      map.movableLocationsOf(Par, Army) should be(Set(Pic, Bre, Bur, Gas))
    }
    "define provinces (2)" in {
      Iri.province.isSupplyCenter should be(false)
      Iri.province.homeOf should be(None)

      Wal.province.homeOf should be(Option(England))

      map.movableLocationsOf(Eng, Fleet) should be(
        Set(Iri, Wal, Lon, Nth, Bel, Pic, Bre, Mid)
      )
    }
    "define provinces (3)" in {
      map.movableLocationsOf(Rom, Fleet) should be(Set(Tus, Nap, Tyn))
    }
  }
}
