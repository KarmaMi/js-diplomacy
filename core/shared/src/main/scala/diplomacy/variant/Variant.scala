package diplomacy.variant

import diplomacy.board._
import diplomacy.rule.{ Order, Rule }

final case class Variant[State_, Power_ <: Power, MilitaryBranch_ <: MilitaryBranch, UnitStatus_, ProvinceStatus_, Order_ <: Order[Power_, MilitaryBranch_], Result_](
  rule: Rule[State_, Power_, MilitaryBranch_, UnitStatus_, ProvinceStatus_, Order_, Result_],
  initialBoard: Board[State_, Power_, MilitaryBranch_, UnitStatus_, ProvinceStatus_]
)
