package diplomacy.board

import scala.collection.mutable

import diplomacy.util.LabeledUndirectedGraph

case class DiplomacyMap[P <: Power, MB <: MilitaryBranch](
  map: LabeledUndirectedGraph[Location[P, MB], Set[MB]]
) {
  type Province = diplomacy.board.Province[P]
  type Location = diplomacy.board.Location[P, MB]
  type DiplomacyUnit = diplomacy.board.DiplomacyUnit[P, MB]

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
