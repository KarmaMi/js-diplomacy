package diplomacy.mock.board

import diplomacy.board.{ MilitaryBranch => BaseMilitaryBranch, Name }

final case class MilitaryBranch(name: Name) extends BaseMilitaryBranch
