package diplomacy.rule

import diplomacy.board.{ Power, MilitaryBranch, DiplomacyUnit }

trait Order[Power_ <: Power, MilitaryBranch_ <: MilitaryBranch] {
  val unit: DiplomacyUnit[Power_, MilitaryBranch_]
}
