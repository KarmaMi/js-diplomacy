import { LabeledUndirectedGraph } from "../util/module"
import { Province } from "./province"
import { Location } from "./location"

/**
 * Map of Diplomacy
 */
export class DiplomacyMap<Power, MilitaryBranch> {
  /**
   * The set of locations in this map
   */
  locations: Set<Location<Power, MilitaryBranch>>
  /**
   * The set of provinces in this map
   */
  provinces: Set<Province<Power>>
  /**
   * The set of powers in this map
   */
  powers: Set<Power>
  private provinceToLocation: Map<Province<Power>, Set<Location<Power, MilitaryBranch>>>
  /**
   * @param map The labeled graph that represents the map.
   */
  constructor (
    private map: LabeledUndirectedGraph<Location<Power, MilitaryBranch>, Set<MilitaryBranch>>
  ) {
    this.locations = new Set()
    this.map.edges.forEach(elem => {
      this.locations.add(elem.n0)
      this.locations.add(elem.n1)
    })

    this.provinces = new Set()
    this.provinceToLocation = new Map()
    this.locations.forEach(elem => {
      this.provinces.add(elem.province)

      if (!this.provinceToLocation.has(elem.province)) {
        this.provinceToLocation.set(elem.province, new Set())
      }
      const locs = this.provinceToLocation.get(elem.province)
      if (locs) {
        locs.add(elem)
      }
    })

    this.powers = new Set()
    this.provinces.forEach(province => {
      if (province.homeOf) {
        this.powers.add(province.homeOf)
      }
    })
  }

  /**
   * @param province The province
   * @return The set of locations that the province has.
   */
  locationsOf (province: Province<Power>): Set<Location<Power, MilitaryBranch>> {
    return this.provinceToLocation.get(province) || new Set()
  }
  /**
   * @param province The province
   * @param militaryBranch The military branch
   * @return The set of provinces that the military branch in the province can move.
   */
  movableProvincesOf (
    province: Province<Power>, militaryBranch: MilitaryBranch
  ): Set<Province<Power>> {
    const retval = new Set()
    const locations = this.locationsOf(province)
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
  movableLocationsOf (
    location: Location<Power, MilitaryBranch>, militaryBranch: MilitaryBranch
  ): Set<Location<Power, MilitaryBranch>> {
    return new Set(
      [...this.map.neighborsOf(location)]
        .filter(elem => elem[1].has(militaryBranch)).map(elem => elem[0])
    )
  }
}
