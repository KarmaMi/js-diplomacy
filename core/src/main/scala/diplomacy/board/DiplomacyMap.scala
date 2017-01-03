package diplomacy.board

import scala.collection.mutable

import diplomacy.util.LabeledUndirectedGraph

final case class DiplomacyMap[P <: Power, MB <: MilitaryBranch](
  map: LabeledUndirectedGraph[Location[P, MB], Set[MB]]
) {
  object Types extends DiplomacyUnit.TypeHelper {
    type Power = P
    type MilitaryBranch = MB
  }
  import Types._

  def locationsOf(province: Province): Set[Location] = {
    require(this.province2Locations contains province)
    this.province2Locations(province)
  }
  def movableProvincesOf(province: Province, militaryBranch: MB): Set[Province] = {
    this.locationsOf(province) flatMap { location =>
      this.movableLocationsOf(location, militaryBranch) map { _.province }
    }
  }
  def movableLocationsOf(unit: DiplomacyUnit): Set[Location] = {
    movableLocationsOf(unit.location, unit.militaryBranch)
  }
  def movableLocationsOf(location: Location, militaryBranch: MB): Set[Location] = {
    (this.map.neighborsOf(location) collect {
      case (l, mbs) if mbs contains militaryBranch => l
    })(collection.breakOut)
  }

  val locations: Set[Location] = this.map.vertices
  val provinces: Set[Province] = this.locations map { _.province }
  val militaryBranches: Set[MB] = {
    val x1 = this.locations flatMap { _.militaryBranches }
    val x2 = this.map.edges flatMap { _._2 }
    x1 ++ x2
  }
  val powers: Set[P] = this.provinces flatMap { _.homeOf }

  private[this] val province2Locations: Map[Province, Set[Location]] = {
    val x = mutable.Map[Province, mutable.Set[Location]]()
    locations.foreach { location =>
      if (!(x contains location.province)) {
        x(location.province) = mutable.Set()
      }
      x(location.province) += location
    }
    (x map { case (k, v) => k -> v.toSet }).toMap
  }
}

object DiplomacyMap {
  trait TypeHelper extends diplomacy.board.DiplomacyUnit.TypeHelper {
    type DiplomacyMap = diplomacy.board.DiplomacyMap[Power, MilitaryBranch]
  }
}
