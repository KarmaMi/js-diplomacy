import { OrderGenerator } from "./order-generator"
import { StandardRuleUtils } from "./standard-rule-utils"
import { Disband } from "./order"
import { Board, Unit } from "./types"

export class BuildOrderGenerator<Power> implements OrderGenerator<Power> {
  ordersToSkipPhase (board: Board<Power>) {
    const numberOfSupplyCenters = StandardRuleUtils.numberOfSupplyCenters(board)

    const canSkip = [...board.map.powers].every(power => {
      const numOfUnits = ([...board.units].filter(unit => unit.power === power)).length
      const numOfSupply = numberOfSupplyCenters.get(power) || 0

      return (numOfUnits === numOfSupply) || (numOfSupply === 0)
    })

    if (canSkip) {
      const orders = new Set()
      board.map.powers.forEach(power => {
        const units = [...board.units].filter(unit => unit.power === power)
        const numOfSupply = numberOfSupplyCenters.get(power) || 0
        if (numOfSupply === 0) {
          units.map(unit => new Disband(unit)).forEach(o => orders.add(o))
        }
      })
      return orders
    } else {
      return null
    }
  }
  defaultOrderOf (board: Board<Power>, unit: Unit<Power>) {
    return null
  }
}
