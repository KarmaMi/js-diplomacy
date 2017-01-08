package diplomacy.board

import scala.language.dynamics

trait LocationHelper[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch]
    extends Dynamic with Location.TypeHelper {
  type Power = Power_
  type MilitaryBranch = MilitaryBranch_
  def selectDynamic(name: String): Location = this.name2Location(name)

  protected[this] val locations: Set[Location]
  private[this] lazy val name2Location = (locations map { l => l.toString -> l }).toMap
}

object LocationHelper {
  def apply[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch](
    locationSet: Set[Location[Power_, MilitaryBranch_]]
  ): LocationHelper[Power_, MilitaryBranch_] = new LocationHelper[Power_, MilitaryBranch_] {
    protected[this] lazy val locations = locationSet
  }
}
