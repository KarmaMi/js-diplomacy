package diplomacy.board

import diplomacy.UnitSpec
import diplomacy.util.LabeledUndirectedGraph
import diplomacy.mock.board._

class DiplomacyMapSpec extends UnitSpec {
  "A diplomacy-map" should {
    "return a set of locations in the province." in {
      map.locationsOf(spaP) should be(Set(spa, spaSc))
    }
    "return locations that an unit can move to." in {
      map.movableLocationsOf(DiplomacyUnit(france, army, spa)) should be(Set())
      map.movableLocationsOf(DiplomacyUnit(france, fleet, spaSc)) should be(Set(wes))
      map.movableLocationsOf(DiplomacyUnit(france, fleet, apu)) should be(Set())
    }
    "return provinces that an unit in the province can move to." in {
      map.movableProvincesOf(spaP, fleet) should be(Set(wesP))
    }
  }
}
