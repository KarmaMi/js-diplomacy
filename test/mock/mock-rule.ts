import { Order } from "../../src/rule/order"
import { Rule } from "../../src/rule/rule"
import { Name, Board, Unit } from "../../src/board/module"
import { Failure } from "../../src/util/module"

export class MockRule extends Rule<string, Name, string, string, string, string> {
  protected unitsRequiringOrder (
    board: Board<string, Name, string, string, string>
  ) {
    return new Set()
  }
  protected defaultOrderOf (
    board: Board<string, Name, string, string, string>,
    unit: Unit<string, Name>
  ) {
    return null
  }
  protected errorMessageOfOrder (
    board: Board<string, Name, string, string, string>,
    order: Order<string, Name>
  ) {
    return null
  }
  protected errorMessageOfOrders (
    board: Board<string, Name, string, string, string>,
    orders: Set<Order<string, Name>>
  ) {
    return null
  }
  protected resolveProcedure (
    board: Board<string, Name, string, string, string>,
    orders: Set<Order<string, Name>>
  ) {
    return new Failure("")
  }
}
