package diplomacy.mock.board

import diplomacy.board.Board

trait TypeHelper extends Board.TypeHelper {
  type Power = MockPower
  type MilitaryBranch = MockMilitaryBranch
  type State = String
  type UnitStatus = String
  type ProvinceStatus = String
}
