package diplomacy.variant.standard.board

import diplomacy.variant.standard.rule.{ Turn => BaseTurn }
import diplomacy.variant.standard.board.Keywords._

case class Turn(year: Int, season: Season) extends BaseTurn {
  override def toString: String = s"${year}-${season}"
  val isBuildable: Boolean = season == Autumn
  val isOccupationUpdateable: Boolean = season == Autumn
}

object Turn {
  def nextTurn(turn: Turn): Turn = turn match {
    case Turn(year, Spring) => Turn(year, Autumn)
    case Turn(year, Autumn) => Turn(year + 1, Spring)
  }
}
