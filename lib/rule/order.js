'use strict'

/**
 * @classdesc Order of DiplomacyMap
 * @memberof rule
 * @prop {!board.Unit} unit - The unit of Diplomacy that corresponds to this order.
 */
class Order {
  /**
   * @constructor
   * @param {!board.Unit} unit - The unit of Diplomacy that corresponds to this order.
   */
  constructor (unit) {
    this.unit = unit
  }
}

module.exports = Order
