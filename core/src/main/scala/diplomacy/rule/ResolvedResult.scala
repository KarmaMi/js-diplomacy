package diplomacy.rule

import diplomacy.board.{ Power, MilitaryBranch, Board }

// TODO
final case class ResolvedResult[State, P <: Power, MB <: MilitaryBranch, UnitStatus, ProvinceStatus, O <: Order[P, MB], Result](
  board: Board[State, P, MB, UnitStatus, ProvinceStatus],
  result: Set[OrderResult.OrderResult[P, MB, O, Result]]
)
