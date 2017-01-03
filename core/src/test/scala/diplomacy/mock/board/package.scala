package diplomacy.mock

import diplomacy.board._
import diplomacy.util.LabeledUndirectedGraph

package object board extends TypeHelper {
  val fleet = MockMilitaryBranch(Name("Fleet", "F"))
  val army = MockMilitaryBranch(Name("Army", "A"))

  val france = MockPower("France")

  val marP = Province[Power](Name("Mar"), Option(france), true)
  val mar = Location(marP, Set(army, fleet))

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
      Set((spaSc -> wes, Set(fleet)), (wes -> nap, Set(fleet)), (nap -> apu, Set(army)))
    )
  )
}
