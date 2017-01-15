package diplomacy.variant.standard.map

import diplomacy.UnitSpec
import diplomacy.board.DiplomacyMapHelper

class MapSpec extends UnitSpec {
  val $ = DiplomacyMapHelper(map)
  "A map instance" should {
    "define provinces (1)" in {
      Pic.province.isSupplyCenter should be(false)
      Pic.province.homeOf should be(Option($.p.France))

      Bre.province.isSupplyCenter should be(true)
      Bre.province.homeOf should be(Option($.p.France))

      Bur.province.isSupplyCenter should be(false)
      Bur.province.homeOf should be(Option($.p.France))

      Gas.province.isSupplyCenter should be(false)
      Gas.province.homeOf should be(Option($.p.France))

      map.movableLocationsOf(Par, $.m.A) should be(Set(Pic, Bre, Bur, Gas))
    }
    "define provinces (2)" in {
      Iri.province.isSupplyCenter should be(false)
      Iri.province.homeOf should be(None)

      Wal.province.homeOf should be(Option($.p.England))

      map.movableLocationsOf(Eng, $.m.F) should be(
        Set(Iri, Wal, Lon, Nth, Bel, Pic, Bre, Mid)
      )
    }
    "define provinces (3)" in {
      map.movableLocationsOf(Rom, $.m.F) should be(Set(Tus, Nap, Tyn))
    }
  }
}
