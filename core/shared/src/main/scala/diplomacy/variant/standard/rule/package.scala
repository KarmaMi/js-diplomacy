package diplomacy.variant.standard

import diplomacy.board.{ Power, Location, DiplomacyUnit }
import diplomacy.board.Power

package object rule {
  /* Type Aliases */
  type Location[Power_ <: Power] = diplomacy.board.Location[Power_, MilitaryBranch]
  type DiplomacyUnit[Power_ <: Power] =
    diplomacy.board.DiplomacyUnit[Power_, MilitaryBranch]
  type DiplomacyMap[Power_ <: Power] =
    diplomacy.board.DiplomacyMap[Power_, MilitaryBranch]
  type Board[Turn_ <: Turn, Power_ <: Power] =
    diplomacy.board.Board[State[Turn_], Power_, MilitaryBranch, UnitStatus[Power_], ProvinceStatus]
}
