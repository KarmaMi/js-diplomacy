package diplomacy.board

import scala.scalajs.js.annotation.{ JSExport, JSExportAll }

import diplomacy.util.JsConverters._

@JSExport @JSExportAll
final case class JsDiplomacyMap[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch](
  map: DiplomacyMap[Power_, MilitaryBranch_]
) {
  def locationsOf(province: JsProvince[Power_]) = {
    fromTraversable(this.map.locationsOf(province.province) map { l => JsLocation(l) })
  }
  def movableProvincesOf(province: JsProvince[Power_], militaryBranch: MilitaryBranch_) = {
    fromTraversable(
      this.map.movableProvincesOf(province.province, militaryBranch) map { p => JsProvince(p) }
    )
  }
  def movableLocationsOf(
    location: JsLocation[Power_, MilitaryBranch_], militaryBranch: MilitaryBranch_
  ) = {
    fromTraversable(
      this.map.movableLocationsOf(location.location, militaryBranch) map { l => JsLocation(l) }
    )
  }

  val locations = fromTraversable(this.map.locations map { l => JsLocation(l) })
  val provinces = fromTraversable(this.map.provinces map { p => JsProvince(p) })
  val militaryBranches = fromTraversable(this.map.militaryBranches)
  val powers = fromTraversable(this.map.powers)

  override def toString: String = s"JS ${map}"
}
