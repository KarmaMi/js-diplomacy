package diplomacy.board

import scala.language.dynamics

trait DiplomacyMapHelper[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch] extends Dynamic {
  protected[this] val map: DiplomacyMap[Power_, MilitaryBranch_]
  lazy val location = LocationHelper(map.locations)
  lazy val l = location
  lazy val power = PowerHelper(map.powers)
  lazy val p = power
  lazy val militaryBranch = MilitaryBranchHelper(map.militaryBranches)
  lazy val m = militaryBranch

  def selectDynamic(name: String) = this.location.selectDynamic(name)
}

object DiplomacyMapHelper {
  def apply[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch](
    diplomacyMap: DiplomacyMap[Power_, MilitaryBranch_]
  ): DiplomacyMapHelper[Power_, MilitaryBranch_] = new DiplomacyMapHelper[Power_, MilitaryBranch_] {
    protected[this] val map = diplomacyMap
  }
}
