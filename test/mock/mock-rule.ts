import { rule } from "../../src/rule"
import { board } from "../../src/board"
import { util } from "../../src/util"
const { Failure } = util

export class MockRule extends rule.Rule<string, board.Name, string, string, string, string, string> {
  protected unitsRequiringOrder (
    board: board.Board<string, board.Name, string, string, string>
  ) {
    return new Set()
  }
  protected defaultOrderOf (
    board: board.Board<string, board.Name, string, string, string>,
    unit: board.Unit<string, board.Name>
  ) {
    return null
  }
  protected errorOfOrder (
    board: board.Board<string, board.Name, string, string, string>,
    order: rule.Order<string, board.Name>
  ) {
    return null
  }
  protected errorOfOrders (
    board: board.Board<string, board.Name, string, string, string>,
    orders: Set<rule.Order<string, board.Name>>
  ) {
    return null
  }
  protected resolveProcedure (
    board: board.Board<string, board.Name, string, string, string>,
    orders: Set<rule.Order<string, board.Name>>
  ) {
    return new Failure("")
  }
}
