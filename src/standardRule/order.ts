import { Unit, Location } from "./types"
import { rule } from "./../rule"
import { MilitaryBranch } from "./data"

export enum OrderType {
  Hold = 1,
  Move,
  Support,
  Convoy,
  Retreat,
  Disband,
  Build
}

/**
 * Order of the standard rule
 */
export abstract class Order<Power> implements rule.Order<Power, MilitaryBranch> {
  /**
   * @param unit The unit that corresponds to this order.
   * @param tpe The type of the order
   */
  constructor (public unit: Unit<Power>, public tpe: OrderType) {}
}

/**
 * Hold order
 */
export class Hold<Power> extends Order<Power> {
  /**
   * @param unit The unit that corresponds to this order.
   */
  constructor (unit: Unit<Power>) {
    super(unit, OrderType.Hold)
  }
  toString () {
    return `${this.unit} H`
  }
}
/**
 * Move order
 */
export class Move<Power> extends Order<Power> {
  /**
   * The flag whether this move order uses convoy or not.
   */
  useConvoy: boolean
  /**
   * @param unit The unit that corresponds to this order.
   * @param destination The destination of this move order.
   * @param useConvoy The flag whether this move order uses convoy or not.
   */
  constructor (unit: Unit<Power>, public destination: Location<Power>, useConvoy?: boolean) {
    super(unit, OrderType.Move)
    this.useConvoy = useConvoy || false
  }
  toString () {
    if (this.useConvoy) {
      return `${this.unit}-${this.destination} via Convoy`
    } else {
      return `${this.unit}-${this.destination}`
    }
  }
}
/**
 * Support order
 */
export class Support<Power> extends Order<Power> {
  /**
   * The destination of this support order (the move destination or the location of the holded unit).
   */
  destination: Location<Power>
  /**
   * @param unit The unit that corresponds to this order.
   * @param target The target order of this support.
   */
  constructor (unit: Unit<Power>, public target: Move<Power> | Hold<Power>) {
    super(unit, OrderType.Support)
    console.assert(target.tpe === OrderType.Move || target.tpe === OrderType.Hold)

    if (target instanceof Move) {
      this.destination = target.destination
    } else {
      this.destination = target.unit.location
    }
  }
  toString () {
    return `${this.unit} S ${this.target}`
  }
}
/**
 * Convoy order
 */
export class Convoy<Power> extends Order<Power> {
  /**
   * @param unit The unit that corresponds to this order.
   * @param target The target order of this convoy.
   */
  constructor (unit: Unit<Power>, public target: Move<Power>) {
    super(unit, OrderType.Convoy)
    console.assert(target.tpe === OrderType.Move)
  }
  toString () {
    return `${this.unit} C ${this.target}`
  }
}

/**
 * Retreat order
 */
export class Retreat<Power> extends Order<Power> {
  /**
   * @param unit The unit that corresponds to this order.
   * @param destination The destination of this retreat.
   */
  constructor (unit: Unit<Power>, public destination: Location<Power>) {
    super(unit, OrderType.Retreat)
  }
  toString () {
    return `${this.unit} R ${this.destination}`
  }
}
/**
 * Disband order
 */
export class Disband<Power> extends Order<Power> {
  /**
   * @param unit The unit that corresponds to this order.
   */
  constructor (unit: Unit<Power>) {
    super(unit, OrderType.Disband)
  }
  toString () {
    return `Disband ${this.unit}`
  }
}
/**
 * Build order
 */
export class Build<Power> extends Order<Power> {
  /**
   * @param unit The unit that corresponds to this order.
   */
  constructor (unit: Unit<Power>) {
    super(unit, OrderType.Build)
  }
  toString () {
    return `Build ${this.unit}`
  }
}
