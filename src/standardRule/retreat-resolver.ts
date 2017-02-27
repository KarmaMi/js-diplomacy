import { Resolver } from "./resolver"
import { Result, Phase, State, MilitaryBranch, ProvinceStatus } from "./data"
import { Order, Retreat, Disband, OrderType } from "./order"
import { StandardRuleUtils } from "./standard-rule-utils"
import { Board, Unit, ResolvedResult } from "./types"
import { board } from "./../board"
import { rule } from "./../rule"
import { util } from "./../util"

declare type Province<Power> = board.Province<Power>
const { Province } = board
const { Executed } = rule
const { Success } = util

const { Movement, Build } = Phase

export class RetreatResolver<Power> implements Resolver<Power> {
  resolve (board: Board<Power>, orders: Set<Order<Power>>) {
    const disbands: Array<Disband<Power>> =
      [...orders].filter(order => order.tpe === OrderType.Disband)
    const retreats: Array<Retreat<Power>> =
      <Array<Retreat<Power>>>([...orders].filter(order => order.tpe === OrderType.Retreat))

    const retval = new Map()
    disbands.forEach(order => retval.set(order, Result.Success))

    // Create a map from province to retreat order
    const province2RetreatUnits = new Map<Province<Power>, Array<Retreat<Power>>>()
    retreats.forEach(order => {
      const elem = province2RetreatUnits.get(order.destination.province) || []
      elem.push(order)
      province2RetreatUnits.set(order.destination.province, elem)
    })

    // Resolve retreat orders
    province2RetreatUnits.forEach((orders, province) => {
      if (orders.length === 1) {
        orders.forEach(order => retval.set(order, Result.Success))
      } else {
        orders.forEach(order => retval.set(order, Result.Failed))
      }
    })

    // Generate a new board
    const unit2Result = new Map([...retval].map(elem => {
      return (<[Unit<Power>, [Order<Power>, Result]]>[elem[0].unit, [elem[0], elem[1]]])
    }))
    const newUnits = new Set()
    board.units.forEach(unit => {
      const result = unit2Result.get(unit)
      if (result) {
        const [order, r] = result
        if (order instanceof Retreat && r === Result.Success) {
          newUnits.add(new Unit(unit.militaryBranch, order.destination, unit.power))
        }
      } else {
        newUnits.add(unit)
      }
    })

    const newState = (board.state.turn.isBuildable)
      ? new State(board.state.turn, Build)
      : new State(board.state.turn.nextTurn(), Movement)

    // Update occupation if needed
    const occupationStatuses = [...board.provinceStatuses]
      .filter(elem => elem[1].occupied)
      .map(elem => {
        if (elem[1].standoff) {
          return <[Province<Power>, ProvinceStatus<Power>]>[elem[0], new ProvinceStatus(elem[1].occupied, false)]
        } else {
          return elem
        }
      })
    const newProvinceStatuses = new Map([...occupationStatuses])
    if (board.state.turn.isOccupationUpdateable) {
      newUnits.forEach(unit => {
        newProvinceStatuses.set(unit.location.province, new ProvinceStatus(unit.power, false))
      })
    }

    const newBoard = new Board(board.map, newState, newUnits, [], newProvinceStatuses)
    const orderResults = [...retval].map(elem => {
      const [order, result] = elem
      return new Executed<Power, MilitaryBranch, Result>(order, result)
    })

    const numOfCenters = ([...board.map.provinces].filter(p => p.isSupplyCenter)).length
    const numberOfSupplyCenters = StandardRuleUtils.numberOfSupplyCenters(newBoard)
    const isFinished = [...newBoard.map.powers].some(power => {
      return (numberOfSupplyCenters.get(power) || 0) > (numOfCenters / 2)
    })

    return new Success(new ResolvedResult(newBoard, orderResults, isFinished))
  }
}
