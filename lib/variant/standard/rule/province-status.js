'use strict'

/**
 * @classdesc Status of the {@link board.Province}
 * @memberof variant.standard.rule
 * @prop {?(string|Object)} occupied -
 *   The power that occupies the province. The province is neutral if this property is null
 * @prop {!boolean} standoff - The flag whether standoff is occurred or not
 */
class ProvinceStatus {
  /**
   * @constructor
   * @param {?(string|Object)} occupied -
   *   The power that occupies the province. The province is neutral if this property is null
   * @param {!boolean} standoff - The flag whether standoff is occurred or not
   */
  constructor (occupied, standoff) {
    this.occupied = occupied
    this.standoff = standoff
  }
}

module.exports = ProvinceStatus
