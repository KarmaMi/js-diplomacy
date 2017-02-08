'use strict'

const { LabeledUndirectedGraph } = require('../util/package')
const provinceToLocation = Symbol('provinceToLocation')

/**
 * @classdesc Map of Diplomacy
 * @memberof board
 * @prop {!util.LabeledUndirectedGraph.<board.Location, board.MapEdge>} map -
 *   The labeled graph that represents the map.
 * @prop {!Set.<board.Location>} locations - The set of {@link board.Location}
 * @prop {!Set.<board.Province>} provinces - The set of {@link board.Province}
 * @prop {!Set.<string|Object>} powers - The set of powers
 */
class DiplomacyMap {
  /**
   * @constructor
   * @param
   *   {!(util.LabeledUndirectedGraph.<board.Location, board.MapEdge>|Set.<board.MapEdge>)} a1 -
   *   The labeled graph that represents the map.
   *   If a1 is Array, the labeled graph is created using a1 as edges.
   */
  constructor (a1) {
    if (Array.isArray(a1)) {
      this.map = new LabeledUndirectedGraph(a1)
    } else {
      this.map = a1
    }

    this.locations = new Set()
    this.map.edges.forEach(elem => {
      this.locations.add(elem.edge[0])
      this.locations.add(elem.edge[1])
    })

    this.provinces = new Set()
    this[provinceToLocation] = new Map()
    this.locations.forEach(elem => {
      this.provinces.add(elem.province)

      if (!this[provinceToLocation].has(elem.province)) {
        this[provinceToLocation].set(elem.province, new Set())
      }
      this[provinceToLocation].get(elem.province).add(elem)
    })

    this.powers = new Set()
    this.provinces.forEach(province => {
      if (province.homeOf) {
        this.powers.add(province.homeOf)
      }
    })
  }

  /**
   * @param {!board.Province} province - The province
   * @return {?Set.<board.Location>} - The set of locations that the province has.
   */
  locationsOf (province) {
    return this[provinceToLocation].get(province)
  }
  /**
   * @param {!board.Province} province - The province
   * @param {!(string|Object)} militaryBranch - The military branch
   * @return {!Set.<board.Province>} -
   *   The set of provinces that the military branch in the province can move.
   */
  movableProvincesOf (province, militaryBranch) {
    const retval = new Set()
    this.locationsOf(province).forEach(location => {
      this.movableLocationsOf(location, militaryBranch).forEach(location => {
        retval.add(location.province)
      })
    })
    return retval
  }
  /**
   * @param {!board.Location} location - The location
   * @param {!(string|Object)} militaryBranch - The military branch
   * @return {!Set.<board.Location>} -
   *   The set of locations that the military branch in the location can move.
   */
  movableLocationsOf (location, militaryBranch) {
    return new Set(
      [...this.map.neighborsOf(location)]
        .filter(elem => elem[1].has(militaryBranch)).map(elem => elem[0])
    )
  }
}

module.exports = DiplomacyMap
