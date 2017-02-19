import { Result } from "./result"
import { MilitaryBranch } from "./military-branch"
import { StandardRuleUtils } from "./standard-rule-utils"
import { OrderType, Order, Convoy, Support, Move } from "./order"
import { DiplomacyMap } from "./types"
import { MovementOrderWithResult } from "./movement-order-with-result"

const { Fleet } = MilitaryBranch

export interface Route {
  viaConvoy: boolean
}
export class MovementOrderGroup<Power> {
  relatedOrders: Set<MovementOrderWithResult<Power>>
  constructor (
    public target: MovementOrderWithResult<Power>,
    relatedOrders: Set<MovementOrderWithResult<Power>> | Array<MovementOrderWithResult<Power>>
  ) {
    this.relatedOrders = new Set([...relatedOrders])
  }
  validSupports (): Set<Support<Power>> {
    return new Set(
      [...this.relatedOrders].filter(order => {
        return (order.order.tpe === OrderType.Support) &&
          (order.getResult() !== Result.Dislodged) && (order.getResult() !== Result.Cut) &&
          (order.getResult() !== Result.NoCorrespondingOrder)
      }).map(order => <Support<Power>>order.order)
    )
  }

  power (): number {
    return 1 + this.validSupports().size
  }

  route (map: DiplomacyMap<Power>): Route | null {
    if (this.target.order instanceof Move) {
      const units = [...this.relatedOrders].filter(order => {
        return (order.order.tpe === OrderType.Convoy) &&
          ((order.getResult() === Result.Failed) || (order.getResult() === Result.Success))
      }).map(order => order.order.unit)

      if (
        StandardRuleUtils.isMovableViaSea(
          map, this.target.order.unit.location.province, this.target.order.destination.province,
          new Set(units)
        )
      ) {
        return { viaConvoy: true }
      } else if (
        map.movableLocationsOf(this.target.order.unit.location, this.target.order.unit.militaryBranch).has(this.target.order.destination)
      ) {
        return { viaConvoy: false }
      } else {
        return null
      }
    } else {
      return null
    }
  }
}
