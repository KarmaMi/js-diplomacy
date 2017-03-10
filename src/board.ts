import { graph } from "./graph"
const { LabeledEdge, LabeledUndirectedGraph } = graph

export namespace board {
  /**
   * Name of atomic components (e.g., provinces)
   */
  export class Name {
    abbreviatedName: string
    /**
     * @param name The name
     * @param abbreviatedName The abbreviated name. name is used if this param is not specified.
     */
    constructor (public name: string, abbreviatedName?: string) {
      this.abbreviatedName = abbreviatedName || name
    }
    toString () {
      return this.abbreviatedName
    }
  }

  /**
   * Province in Diplomacy map
   */
  export class Province<Power> {
    isSupplyCenter: boolean
    /**
     * @param name The name of this province
     * @param homeOf
     *   The power that has this province as a home country.
     *   This is a neutral province if null is set.
     * @param isSupplyCenter The flag whether this is a supply center or not.
     */
    constructor (public name: Name, public homeOf: Power | null, isSupplyCenter?: boolean) {
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

  /**
   * Location in Diplomacy map. Each province is expected to have 1 location at least.
   */
  export class Location<Power, MilitaryBranch> {
    /**
     * The set of military branches that can enter this location.
     */
    militaryBranches: Set<MilitaryBranch>
    /**
     * @param name The name of this location. It is usually same as the name of the province
     * @param province The province that this location is in.
     * @param militaryBranches The set of military branches that can enter this location.
     */
    constructor (
      public name: Name, public province: Province<Power>,
      militaryBranches: Set<MilitaryBranch> | Array<MilitaryBranch>
    ) {
      this.militaryBranches = new Set([...militaryBranches])
    }
    toString () {
      return `${this.name}`
    }
  }


  /**
   * Unit of Diplomacy
   */
  export class Unit<Power, MilitaryBranch> {
    /**
     * @param militaryBranch The military branch of this unit.
     * @param location The location where this unit is in.
     * @param power The power that has this unit.
     */
    constructor (
      public militaryBranch: MilitaryBranch, public location: Location<Power, MilitaryBranch>,
      public power: Power
    ) {
      console.assert(this.location.militaryBranches.has(militaryBranch))
    }

    toString () {
      return `${this.militaryBranch} ${this.location}`
    }
  }

  /**
   * Relation between board.Location
   */
  export class MapEdge<Power, MilitaryBranch>
    extends graph.LabeledEdge<Location<Power, MilitaryBranch>, Set<MilitaryBranch>> {
    /**
     * @param n1 The end point 1.
     * @param n2 The end point 2.
     * @param label The set of military branches.
     */
    constructor (
      n1: Location<Power, MilitaryBranch>, n2: Location<Power, MilitaryBranch>,
      militaryBranches: Set<MilitaryBranch> | Array<MilitaryBranch>
    ) {
      super(n1, n2, new Set([...militaryBranches]))
    }
  }

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
      private map: graph.LabeledUndirectedGraph<Location<Power, MilitaryBranch>, Set<MilitaryBranch>>
    ) {
      this.locations = this.map.nodes

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

  export class Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus> {
    /**
     * The units that are in this board
     */
    units: Set<Unit<Power, MilitaryBranch>>
    /**
     * The state of each unit (e.g., the unit was dislodged)
     */
    unitStatuses: Map<Unit<Power, MilitaryBranch>, UnitStatus>
    /**
     * The state of each province (e.g., standoff was occurred, this province is occupied by X)
     */
    provinceStatuses: Map<Province<Power>, ProvinceStatus>
    /**
     * @param map
     * @param state
     * @param units The units that are in this board
     * @param unitStatuses The state of each unit (e.g., the unit was dislodged)
     * @param provinceStatuses
     *   The state of each province (e.g., standoff was occurred, this province is occupied by X)
     */
    constructor (
      public map: DiplomacyMap<Power, MilitaryBranch>, public state: State,
      units: Set<Unit<Power, MilitaryBranch>> | Array<Unit<Power, MilitaryBranch>>,
      unitStatuses: Map<Unit<Power, MilitaryBranch>, UnitStatus> | Array<[Unit<Power, MilitaryBranch>, UnitStatus]>,
      provinceStatuses: Map<Province<Power>, ProvinceStatus> | Array<[Province<Power>, ProvinceStatus]>
    ) {
      this.units = new Set([...units])
      this.unitStatuses = new Map([...unitStatuses])
      this.provinceStatuses = new Map([...provinceStatuses])
    }
  }
}
