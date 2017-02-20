import { Resolver } from "./resolver"
import { Result } from "./result"
import { Phase } from "./phase"
import { Board, ResolvedResult } from "./types"
import { State } from "./state"
import { Order, OrderType } from "./order"
import { ProvinceStatus } from "./province-status"
import { Province } from "./../../../board/module"
import { Executed } from "./../../../rule/module"
import { Success } from "./../../../util/module"

const Movement = Phase.Movement

export class BuildResolver<Power> implements Resolver<Power> {
  resolve (board: Board<Power>, orders: Set<Order<Power>>) {
    const disbands = [...orders].filter(order => order.tpe === OrderType.Disband)
    const builds = [...orders].filter(order => order.tpe === OrderType.Build)

    const newUnits = new Set([...board.units])
    disbands.forEach(d => newUnits.delete(d.unit))
    builds.forEach(b => newUnits.add(b.unit))

    const newState = new State(board.state.turn.nextTurn(), Movement)
    const occupationStatuses = [...board.provinceStatuses]
      .filter(elem => elem[1].occupied)
      .map(elem => {
        if (elem[1].standoff) {
          return <[Province<Power>, ProvinceStatus<Power>]>[elem[0], new ProvinceStatus<Power>(elem[1].occupied, false)]
        } else {
          return elem
        }
      })
    const newBoard = new Board<Power>(board.map, newState, newUnits, [], occupationStatuses)
    const orderResults = [...orders].map(order => new Executed(order, Result.Success))

    return new Success(new ResolvedResult(newBoard, orderResults, false))
  }
}
