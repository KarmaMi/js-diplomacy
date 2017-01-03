package diplomacy.mock.board

import diplomacy.board.{ MilitaryBranch => BaseMilitaryBranch, Name }

final case class MockMilitaryBranch(name: Name) extends BaseMilitaryBranch