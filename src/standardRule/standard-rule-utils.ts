import { board } from "./../board"
import { MilitaryBranch } from "./data"
import { Location, Unit, DiplomacyMap, Board } from "./types"

const { Province } = board

/*
/**
 * Utility of the standard rule
 */
export class Utils {
  /**
   * @param board -
   * @returns The map between powers and the number of supply centers
   */
  static numberOfSupplyCenters<Power> (board: Board<Power>): Map<Power, number> {
    const retval = new Map()
    board.provinceStatuses.forEach((status, province) => {
      if (!status.occupied) {
        return
      }
      const power = status.occupied
      if (power) {
        const numOfSupply = retval.get(power) || 0
        retval.set(power, numOfSupply + ((province.isSupplyCenter) ? 1 : 0))
      }
    })

    return retval
  }

  /**
   * @returns True if the province is sea. Sea is a province that only Fleet can enter.
   */
  static isSea<Power> (map: DiplomacyMap<Power>, province: board.Province<Power>): boolean {
    return [...map.locationsOf(province)].every(l => {
      return l.militaryBranches.size === 1 && l.militaryBranches.has(MilitaryBranch.Fleet)
    })
  }

  /**
   * @returns The locations that the unit can retreat to.
   */
  static locationsToRetreat<Power> (
    board: Board<Power>, unit: Unit<Power>, attackedFrom: board.Province<Power>
  ): Set<Location<Power>> {
    return new Set(
      [...board.map.movableLocationsOf(unit.location, unit.militaryBranch)].filter(location => {
        const existsUnit =
          [...board.units].some(unit => unit.location.province === location.province)

        const status = board.provinceStatuses.get(location.province)
        if (status && status.standoff) {
          return false
        } else if (location.province === attackedFrom) {
          return false
        } else if (existsUnit) {
          return false
        } else {
          return true
        }
      })
    )
  }

  /**
   * @param units The set of units that is used for convoy
   */
  static isMovableViaSea<Power> (
    map: DiplomacyMap<Power>, source: board.Province<Power>, destination: board.Province<Power>,
    units: Set<Unit<Power>>
  ): boolean {
    const provinces =
      new Set(
        [...units]
          .filter(u => u.militaryBranch === MilitaryBranch.Fleet)
          .map(x => x.location.province)
      )
    const visited = new Set()
    // TODO duplicated code
    function dfs (province: board.Province<Power>): boolean {
      const nextProvinces =
        [...map.movableProvincesOf(province, MilitaryBranch.Fleet)]
          .filter(p => Utils.isSea(map, p) && provinces.has(p))
      return nextProvinces.some(p => {
        if (map.movableProvincesOf(p, MilitaryBranch.Fleet).has(destination)) {
          return true
        } else if (!visited.has(p)) {
          visited.add(p)
          return dfs(p)
        } else {
          return false
        }
      })
    }
    return dfs(source)
  }

  /**
   * @returns The locations that the unit can move to (including via convoy).
   */
  static movableLocationsOf<Power> (board: Board<Power>, unit: Unit<Power>): Set<Location<Power>> {
    const locations = new Set([...board.map.movableLocationsOf(unit.location, unit.militaryBranch)])

    if (unit.militaryBranch === MilitaryBranch.Fleet) {
      return locations
    }

    const provinces = new Set([...board.units].map(x => x.location.province))
    const visited = new Set()
    // TODO duplicated code
    function dfs (province: board.Province<Power>) {
      const nextProvinces =
        [...board.map.movableProvincesOf(province, MilitaryBranch.Fleet)]
          .filter(p => Utils.isSea(board.map, p) && provinces.has(p))
      nextProvinces.forEach(p => {
        if (!visited.has(p)) {
          visited.add(p)
          dfs(p)
        }
      })
    }
    dfs(unit.location.province)

    // The provinces that can use for convoy
    const sea = visited

    sea.forEach(s => {
      [...board.map.movableProvincesOf(s, MilitaryBranch.Fleet)]
        .filter(p => !Utils.isSea(board.map, p))
        .forEach(p => {
          board.map.locationsOf(p).forEach(l => {
            if (l.militaryBranches.has(MilitaryBranch.Army)) {
              locations.add(l)
            }
          })
        })
    })
    return new Set([...locations].filter(x => x.province !== unit.location.province))
  }

  /**
   * @return
   *   The Map between powers and number of buildable units.
   *   If a power should disband some units, this contains negative number
   *   (e.g., It contains -1 if a power has to disband 1 unit).
   */
  static numberOfBuildableUnits<Power> (board: Board<Power>): Map<Power, number> {
    const numberOfSupplyCenters = Utils.numberOfSupplyCenters(board)
    const retval = new Map()
    board.map.powers.forEach(power => {
      const numOfSupply = numberOfSupplyCenters.get(power) || 0
      const numOfUnits = ([...board.units].filter(x => x.power === power)).length
      retval.set(power, numOfSupply - numOfUnits)
    })
    return retval
  }
}
