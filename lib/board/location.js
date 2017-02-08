'use strict'

/**
 * @classdesc Location in Diplomacy map. Each province is expected to have 1 location at least.
 * @memberof board
 * @prop {!board.Name} name -
 *   The name of this location. It is usually same as the name of the province
 * @prop {!board.Province} province - The province that this location is in.
 * @prop {!Array.<string|Object>} militaryBranches -
 *   The set of military branches that can enter this location.
 */
class Location {
  /**
   * @constructor
   * @param {!board.Name} name -
   *   The name of this location. It is usually same as the name of the province
   * @param {!board.Province} province - The province that this location is in.
   * @param {!Array.<string|Object>} militaryBranches -
   *   The set of military branches that can enter this location.
   */
  constructor (name, province, militaryBranches) {
    this.name = name
    this.province = province
    this.militaryBranches = new Set([...militaryBranches])
  }
  toString () {
    return `${this.name}`
  }
}

module.exports = Location
