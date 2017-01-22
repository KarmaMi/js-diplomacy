package diplomacy.variant.standard

import diplomacy.board.{ Power, Location, DiplomacyUnit }
import diplomacy.board.Power

package object rule {
  /*  Military Branch */
  val Army = MilitaryBranch.Army
  val Fleet = MilitaryBranch.Fleet

  /* Phase */
  val Movement = Phase.Movement
  val Retreat = Phase.Retreat
  val Build = Phase.Build

  /* State */
  implicit class Turn2State[Turn_ <: Turn](turn: Turn_) {
    def -(phase: Phase.Phase): State[Turn_] = State(turn, phase)
  }

  /* Type Aliases */
  type Location[Power_ <: Power] = diplomacy.board.Location[Power_, MilitaryBranch]
  type DiplomacyUnit[Power_ <: Power] =
    diplomacy.board.DiplomacyUnit[Power_, MilitaryBranch]
  type DiplomacyMap[Power_ <: Power] =
    diplomacy.board.DiplomacyMap[Power_, MilitaryBranch]
  type Board[Turn_ <: Turn, Power_ <: Power] =
    diplomacy.board.Board[State[Turn_], Power_, MilitaryBranch, UnitStatus[Power_], ProvinceStatus]
}
