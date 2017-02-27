import { Resolver } from "./resolver"
import { Result, Phase, ProvinceStatus, State } from "./data"
import { Board, ResolvedResult } from "./types"
import { Order, OrderType } from "./order"
import { board } from "./../board"
import { rule } from "./../rule"
import { util } from "./../util"

const { Province } = board
const { Executed } = rule
const { Success } = util

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
          return <[board.Province<Power>, ProvinceStatus<Power>]>[elem[0], new ProvinceStatus<Power>(elem[1].occupied, false)]
        } else {
          return elem
        }
      })
    const newBoard = new Board<Power>(board.map, newState, newUnits, [], occupationStatuses)
    const orderResults = [...orders].map(order => new Executed(order, Result.Success))

    return new Success(new ResolvedResult(newBoard, orderResults, false))
  }
}
