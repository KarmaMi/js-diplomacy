'use strict'

/**
 * @classdesc Relation between {@link board.Location}
 * @memberof board
 * @prop {!Array.<board.Location>} edge - The end points.
 * @prop {!Set.<(string|Object)>} label - The set of military branches.
 */
class MapEdge {
  /**
   * @constructor
   * @param {!board.Location} location1 - The end point 1.
   * @param {!board.Location} location2 - The end point 2.
   * @param {!Set.<(string|Object)>} label - The set of military branches.
   */
  constructor (location1, location2, militaryBranches) {
    this.edge = [location1, location2]
    this.label = new Set([...militaryBranches])
  }
}

module.exports = MapEdge
