import { Validator } from "./validator"
import { StandardRuleUtils } from "./standard-rule-utils"
import { OrderType, Order } from "./order"
import { Board, Unit } from "./types"

export class BuildValidator<Power> implements Validator<Power> {
  /**
   * @param stringify Stringify instances of Power
   */
  constructor (private stringify: (power: Power) => String) {}

  unitsRequiringOrder (board: Board<Power>) {
    return new Set()
  }

  errorMessageOfOrder (board: Board<Power>, order: Order<Power>) {
    const numberOfSupplyCenters = StandardRuleUtils.numberOfSupplyCenters(board)
    switch (order.tpe) {
      case OrderType.Build:
        if ([...board.units].some(unit => unit.location.province === order.unit.location.province)) {
          return `An unit is in ${order.unit.location.province.name}`
        } else if (order.unit.location.province.homeOf !== order.unit.power) {
          return `${this.stringify(order.unit.power)} cannot build an unit in ${order.unit.location}`
        } else if (!order.unit.location.province.isSupplyCenter) {
          return `${order.unit.location.province.name} is not supply center`
        } else {
          const status = board.provinceStatuses.get(order.unit.location.province)
          if (!status || status.occupied !== order.unit.power) {
            return `${order.unit.location.province.name} is not occupied by ${this.stringify(order.unit.power)}`
          }
        }
        break
      case OrderType.Disband:
        if (!board.units.has(order.unit)) {
          return `${order.unit} does not exist`
        }
        const numOfUnits =
          ([...board.units].filter(unit => unit.power === order.unit.power)).length
        const numOfSupply = numberOfSupplyCenters.get(order.unit.power) || 0
        if (numOfUnits <= numOfSupply) {
          return `${this.stringify(order.unit.power)} has sufficient supply centers`
        }
        break
      default:
        return `${order} is not for build phase`
    }
    return null
  }

  errorMessageOfOrders (board: Board<Power>, orders: Set<Order<Power>>) {
    const numberOfSupplyCenters = StandardRuleUtils.numberOfSupplyCenters(board)
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
      return `${this.stringify(power)} does not have enough supply centers`
    }
    return null
  }
}
