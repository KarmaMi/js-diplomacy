package diplomacy.board

import diplomacy.UnitSpec
import diplomacy.util.LabeledUndirectedGraph

class DiplomacyMapSpec extends UnitSpec {
  val fleet = new MilitaryBranch { val name = Name("Fleet", "F") }
  val army = new MilitaryBranch { val name = Name("Army", "A") }

  val spaP = Province[Power](Name("Spa"), None, true)
  val spa = Location(spaP, Set(army))
  val spaSc = Location(spaP, Set(fleet))

  val napP = Province[Power](Name("Nap"), None, true)
  val nap = Location(napP, Set(army, fleet))

  val apuP = Province[Power](Name("Apu"), None, false)
  val apu = Location(apuP, Set(army, fleet))

  val wesP = Province[Power](Name("Wes"), None, false)
  val wes = Location(wesP, Set(fleet))

  val map = DiplomacyMap(
    LabeledUndirectedGraph(
      Set(spa, spaSc, wes, apu, nap),
      Set(
        (spaSc -> wes, Set(fleet)), (wes -> nap, Set(fleet)),
        (nap -> apu, Set(army))
      )
    )
  )

  "A diplomacy-map" should {
    "return a set of locations in the province." in {
      map.locationsOf(spaP) should be(Set(spa, spaSc))
    }
    "return locations that an unit can move to." in {
      map.movableLocationsOf(DiplomacyUnit(army, spa)) should be(Set())
      map.movableLocationsOf(DiplomacyUnit(fleet, spaSc)) should be(Set(wes))
      map.movableLocationsOf(DiplomacyUnit(fleet, apu)) should be(Set())
    }
    "return provinces that an unit in the province can move to." in {
      map.movableProvincesOf(spaP, fleet) should be(Set(wesP))
    }
  }
}
