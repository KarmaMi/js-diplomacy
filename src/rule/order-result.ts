import { Order } from "./order"

export interface OrderResult<Power, MilitaryBranch, Result> {
  /**
   * The target order.
   */
  target: Order<Power, MilitaryBranch>
  /**
   * The result of the target.
   */
  result: Result
}

/**
 * Result of an order execution.
 */
export class Executed<Power, MilitaryBranch, Result>
  implements OrderResult<Power, MilitaryBranch, Result> {
  /**
   * @param target The target order.
   * @param result The result of the target.
   */
  constructor (public target: Order<Power, MilitaryBranch>, public result: Result) {}
}
/**
 * Result of an order execution. It is used when the original order is replaced.
 */
export class Replaced<Power, MilitaryBranch, Result>
  implements OrderResult<Power, MilitaryBranch, Result> {
  /**
   * @param target The target order.
   * @param result The result of the target.
   * @param invalidReason The reason why the target is replaced
   * @param replacedBy The order that replaces the target.
   */
  constructor (
    public target: Order<Power, MilitaryBranch>,
    public invalidReason: string,
    public replacedBy: Order<Power, MilitaryBranch>,
    public result: Result
  ) {}
}
