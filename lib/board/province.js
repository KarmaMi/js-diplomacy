'use strict'

/**
 * @classdesc Province in Diplomacy map
 * @memberof board
 * @prop {!board.Name} name - The name of this province
 * @prop {?(string|Object)} homeOf -
 *   The power that has this province as a home country.
 *   This is a neutral province if null is set.
 * @prop {!boolean} isSupplyCenter - The flag whether this is a supply center or not.
 */
class Province {
  /**
   * @constructor
   * @param {!board.Name} name - The name of this province
   * @param {?(string|Object)} homeOf -
   *   The power that has this province as a home country.
   *   This is a neutral province if null is set.
   * @param {!boolean} isSupplyCenter - The flag whether this is a supply center or not.
   */
  constructor (name, homeOf, isSupplyCenter) {
    this.name = name
    this.homeOf = homeOf
    this.isSupplyCenter = isSupplyCenter || false
  }

  toString () {
    if (this.isSupplyCenter) {
      return `${this.name}*`
    } else {
      return this.name.toString()
    }
  }
}
module.exports = Province
