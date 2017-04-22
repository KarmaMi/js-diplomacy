import { Unit, Location } from "./types"
import { Order } from "./order"

export enum ErrorType {
  PowerWithProblem = 1,
  UnmovableLocation,
  UnsupportableLocation,
  UnconvoyableLocation,
  UnbuildableLocation,
  UnitNotExisted,
  CannotBeOrdered,
  InvalidPhase,
  SeveralOrders,
  OrderNotExisted
}

/**
 * Errors while resolving orders
  * @typeparam Detail The detail of the error
 */
export class Error {
  constructor (public tpe: ErrorType) {}
}

/**
 * Error that a power does not satisify conditions.
 * (e.g., A power does not have enough number of supply centers.)
 */
export class PowerWithProblem<Power> extends Error {
  constructor (public power: Power) {
    super(ErrorType.PowerWithProblem)
  }
}

/**
 * Error that a unit tries to move an unmovable location.
 */
export class UnmovableLocation<Power> extends Error {
  constructor (public unit: Unit<Power>, public destination: Location<Power>) {
    super(ErrorType.UnmovableLocation)
  }
}

/**
 * Error that a unit tries to suppor an unsupportable order.
 */
export class UnsupportableLocation<Power> extends Error {
  constructor (public unit: Unit<Power>, public destination: Location<Power>) {
    super(ErrorType.UnsupportableLocation)
  }
}

/**
 * Error that a unit tries to convoy an invalid order.
 */
export class UnconvoyableLocation<Power> extends Error {
  constructor (public unit: Unit<Power>, public destination: Location<Power>) {
    super(ErrorType.UnconvoyableLocation)
  }
}


/**
 * Error that a power tries to build an unbuildable location.
 */
export class UnbuildableLocation<Power> extends Error {
  constructor (public unit: Unit<Power>) {
    super(ErrorType.UnbuildableLocation)
  }
}

/**
 * Error that a unit does not existed.
 */
export class UnitNotExisted<Power> extends Error {
  constructor (public unit: Unit<Power>) {
    super(ErrorType.UnitNotExisted)
  }
}

/**
 * Error that a player writes an invalid order.
 */
export class CannotBeOrdered<Power> extends Error {
  constructor (public order: Order<Power>) {
    super(ErrorType.CannotBeOrdered)
  }
}

/**
 * Error that a player writes an invalid order.
 */
export class InvalidPhase<Power> extends Error {
  constructor (public order: Order<Power>) {
    super(ErrorType.InvalidPhase)
  }
}

export class SeveralOrders<Power> extends Error {
  units: Set<Unit<Power>>
  constructor (units: Set<Unit<Power>> | Array<Unit<Power>>) {
    super(ErrorType.SeveralOrders)
    this.units = new Set([...units])
  }
}

export class OrderNotExisted<Power> extends Error {
  constructor (public unit: Unit<Power>) {
    super(ErrorType.OrderNotExisted)
  }
}
