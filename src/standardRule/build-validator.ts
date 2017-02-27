import { Validator } from "./validator"
import { Utils } from "./standard-rule-utils"
import { OrderType, Order } from "./order"
import { Board, Unit } from "./types"
import * as Error from "./error"

export class BuildValidator<Power> implements Validator<Power> {
  /**
   * @param stringify Stringify instances of Power
   */
  constructor () {}

  unitsRequiringOrder (board: Board<Power>) {
    return new Set()
  }

  errorOfOrder (board: Board<Power>, order: Order<Power>) {
    const numberOfSupplyCenters = Utils.numberOfSupplyCenters(board)
    switch (order.tpe) {
      case OrderType.Build:
        if ([...board.units].some(unit => unit.location.province === order.unit.location.province)) {
          return new Error.UnbuildableLocation(order.unit)
        } else if (order.unit.location.province.homeOf !== order.unit.power) {
          return new Error.UnbuildableLocation(order.unit)
        } else if (!order.unit.location.province.isSupplyCenter) {
          return new Error.UnbuildableLocation(order.unit)
        } else {
          const status = board.provinceStatuses.get(order.unit.location.province)
          if (!status || status.occupied !== order.unit.power) {
            return new Error.UnbuildableLocation(order.unit)
          }
        }
        break
      case OrderType.Disband:
        if (!board.units.has(order.unit)) {
          return new Error.UnitNotExisted(order.unit)
        }
        const numOfUnits =
          ([...board.units].filter(unit => unit.power === order.unit.power)).length
        const numOfSupply = numberOfSupplyCenters.get(order.unit.power) || 0
        if (numOfUnits <= numOfSupply) {
          return new Error.PowerWithProblem(order.unit.power)
        }
        break
      default:
        return new Error.InvalidPhase(order)
    }
    return null
  }

  errorOfOrders (board: Board<Power>, orders: Set<Order<Power>>) {
    const numberOfSupplyCenters = Utils.numberOfSupplyCenters(board)
    const power = [...board.map.powers].find(power => {
      const numOfUnits = ([...board.units].filter(unit => unit.power === power)).length
      const numOfSupply = numberOfSupplyCenters.get(power) || 0
      const diffs = [...orders].map(order => {
        if (order.tpe === OrderType.Build && order.unit.power === power) {
          return 1
        } else if (order.tpe === OrderType.Disband && order.unit.power === power) {
          return -1
        } else {
          return 0
        }
      })
      const diff = diffs.reduce((prev, curr) => prev + curr, 0)
      return (numOfUnits + diff) > numOfSupply
    })

    if (power) {
      return new Error.PowerWithProblem(power)
    }
    return null
  }
}
