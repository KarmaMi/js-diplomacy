package diplomacy.variant.standard.rule

import diplomacy.board.{ MilitaryBranch => BaseMilitaryBranch, Name }

object MilitaryBranch {
  sealed trait MilitaryBranch extends BaseMilitaryBranch

  object Army extends MilitaryBranch {
    val name = Name("Army", "A")
  }
  object Fleet extends MilitaryBranch {
    val name = Name("Fleet", "F")
  }
}
