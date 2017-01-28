package diplomacy.mock.rule

import diplomacy.rule.{ Order => BaseOrder, Rule }
import diplomacy.mock.board.{ TypeHelper => BoardTypeHelper }

trait TypeHelper extends BoardTypeHelper with Rule.TypeHelper {
  type Order = BaseOrder[Power, MilitaryBranch]
  type Result = String
}
