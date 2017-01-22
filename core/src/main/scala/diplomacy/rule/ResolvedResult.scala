package diplomacy.rule

import diplomacy.board.{ Power, MilitaryBranch, Board }

final case class ResolvedResult[State_, Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, UnitStatus_, ProvinceStatus_, Order_ <: Order[Power_, MilitaryBranch_], Result_](
  board: Board[State_, Power_, MilitaryBranch_, UnitStatus_, ProvinceStatus_],
  result: Set[OrderResult[Power_, MilitaryBranch_, Order_, Result_]],
  isFinished: Boolean
)
