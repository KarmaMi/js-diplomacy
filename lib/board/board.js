'use strict'

/**
 * @classdesc
 * @memberof board
 * @prop {!board.DiplomacyMap} map -
 * @prop {!Object} state -
 * @prop {!Set.<board.Unit>} units - The units that are in this board
 * @prop {!Map.<board.Unit,Object>} unitStatuses -
 *   The state of each unit (e.g., the unist was dislodged)
 * @prop {!Map.<board.Province,Object>} provinceStatuses -
 *   The state of each province (e.g., standoff was occurred, this province is occupied by X)
 */
class Board {
  /**
   * @constructor
   * @param {!board.DiplomacyMap} map -
   * @param {!Object} state -
   * @param {!Set.<board.Unit>} units - The units that are in this board
   * @param {!Map.<board.Unit,Object>} unitStatuses -
   *   The state of each unit (e.g., the unist was dislodged)
   * @param {!Map.<board.Province,Object>} provinceStatuses -
   *   The state of each province (e.g., standoff was occurred, this province is occupied by X)
   */
  constructor (map, state, units, unitStatuses, provinceStatuses) {
    this.map = map
    this.state = state
    this.units = new Set([...units])
    this.unitStatuses = new Map([...unitStatuses])
    this.provinceStatuses = new Map([...provinceStatuses])
  }
}

module.exports = Board
