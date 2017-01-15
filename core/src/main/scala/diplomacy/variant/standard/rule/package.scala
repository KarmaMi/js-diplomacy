package diplomacy.variant.standard

import diplomacy.board
import diplomacy.board.{ Power, Location, DiplomacyUnit }

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
}
