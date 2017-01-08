package diplomacy.board

import scala.language.dynamics

trait BoardHelper[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch]
    extends DiplomacyMapHelper[Power_, MilitaryBranch_] with Dynamic with DiplomacyUnit.TypeHelper {
  type Power = Power_
  type MilitaryBranch = MilitaryBranch_

  def applyDynamic(name: String)(location: Location): DiplomacyUnit = {
    this.militaryBranch.selectDynamic(name).apply(location)
  }

  protected[this] val board: Board[_, Power, MilitaryBranch, _, _]
  protected[this] lazy val map = board.map

  implicit class MakeUnitHelper(target: MilitaryBranch) {
    def apply(location: Location): DiplomacyUnit = {
      (board.units find { unit => unit.location == location && unit.militaryBranch == target}).get
    }
  }
}

object BoardHelper {
  def apply[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch](
    target: Board[_, Power_, MilitaryBranch_, _, _]
  ): BoardHelper[Power_, MilitaryBranch_] = new BoardHelper[Power_, MilitaryBranch_] {
    protected[this] lazy val board = target
  }
}
