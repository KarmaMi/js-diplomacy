package diplomacy.variant.standard.map

import diplomacy.variant.standard.rule.{ Turn => BaseTurn }

case class Turn(year: Int, season: Season.Season) extends BaseTurn {
  override def toString: String = s"${year}-${season}"
  val isBuildable: Boolean = season == Season.Autumn
  val isOccupationUpdateable: Boolean = season == Season.Autumn
}
