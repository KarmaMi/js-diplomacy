package diplomacy.variant.standard.board

import diplomacy.variant.standard.rule.{ Turn => BaseTurn }

case class Turn(year: Int, season: Season) extends BaseTurn {
  override def toString: String = s"${year}-${season}"
  val isBuildable: Boolean = season == Autumn
  val isOccupationUpdateable: Boolean = season == Autumn
}