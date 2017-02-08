'use strict'

/**
 * @classdesc Unit of Diplomacy
 * @memberof board
 * @prop {!(string|Object)} militaryBranch - The military branch of this unit.
 * @prop {!board.Location} location - The location where this unit is in.
 * @prop {!(string|Object)} power - The power that has this unit.
 */
class Unit {
  /**
   * @constructor
   * @param {!(string|Object)} militaryBranch - The military branch of this unit.
   * @param {!board.Location} location - The location where this unit is in.
   * @param {!(string|Object)} power - The power that has this unit.
   */
  constructor (militaryBranch, location, power) {
    this.militaryBranch = militaryBranch
    this.location = location
    this.power = power

    console.assert(this.location.militaryBranches.has(militaryBranch))
  }

  toString () {
    return `${this.militaryBranch} ${this.location}`
  }
}

module.exports = Unit
