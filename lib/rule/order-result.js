'use strict'

/**
 * @classdesc Result of an order execution.
 * @memberof rule.OrderResult
 * @prop {!rule.Order} target - The target order.
 * @prop {!(string|Object)} result - The result of the target.
 */
class Executed {
  /**
   * @constructor
   * @param {!rule.Order} target - The target order.
   * @param {!(string|Object)} result - The result of the target.
   */
  constructor (target, result) {
    this.target = target
    this.result = result
  }
}
/**
 * @classdesc Result of an order execution. It is used when the original order is replaced.
 * @memberof rule.OrderResult
 * @prop {!rule.Order} target - The target order.
 * @prop {!(string|Object)} result - The result of the target.
 * @prop {!string} invalidReason - The reason why the target is replaced
 * @prop {!rule.Order} replacedBy - The order that replaces the target.
 */
class Replaced {
  /**
   * @constructor
   * @param {!rule.Order} target - The target order.
   * @param {!(string|Object)} result - The result of the target.
   * @param {!string} invalidReason - The reason why the target is replaced
   * @param {!rule.Order} replacedBy - The order that replaces the target.
   */
  constructor (target, invalidReason, replacedBy, result) {
    this.target = target
    this.result = result
    this.invalidReason = invalidReason
    this.replacedBy = replacedBy
  }
}

/**
 * @namespace
 * @memberof rule
 */
const OrderResult = { Executed: Executed, Replaced: Replaced }

module.exports = OrderResult
