'use strict'

const { Fleet, Army } = require('./military-branch')

/**
 * @classdesc Utility of the standard rule
 * @memberof variant.standard.rule
 */
class StandardRuleUtils {
  /**
   * @param {!board.Board} board -
   * @returns {!Map.<(string|Object),number>} -
   *   The map between powers and the number of supply centers
   */
  static numberOfSupplyCenters (board) {
    const retval = new Map()
    board.provinceStatuses.forEach((status, province) => {
      if (!status.occupied) {
        return
      }
      const power = status.occupied
      const numOfSupply = retval.get(power) || 0
      retval.set(power, numOfSupply + ((province.isSupplyCenter) ? 1 : 0))
    })

    return retval
  }

  /**
   * @param {!board.DiplomacyMap} map -
   * @param {!board.Province} province -
   * @returns {!boolean} - True if the province is sea. Sea is a province that only Fleet can enter.
   */
  static isSea (map, province) {
    return [...map.locationsOf(province)].every(l => {
      return l.militaryBranches.size === 1 && l.militaryBranches.has(Fleet)
    })
  }

  /**
   * @param {!board.Board} board -
   * @param {!board.Unit} unit -
   * @param {!board.Province} attackedFrom -
   * @returns {!Set.<board.Location>} - The locations that the unit can retreat to.
   */
  static locationsToRetreat (board, unit, attackedFrom) {
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
   * @param {!board.Board} board -
   * @param {!board.Unit} unit -
   * @returns {!Set.<board.Location>} -
   *   The locations that the unit can move to (including via convoy).
   */
  static movableLocationsOf (board, unit) {
    const locations = new Set([...board.map.movableLocationsOf(unit.location, unit.militaryBranch)])

    if (unit.militaryBranch === Fleet) {
      return locations
    }

    const provinces = new Set([...board.units].map(x => x.location.province))
    const visited = new Set()
    function dfs (province) {
      const nextProvinces =
        [...board.map.movableProvincesOf(province, Fleet)]
          .filter(p => StandardRuleUtils.isSea(board.map, p) && provinces.has(p))
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
      [...board.map.movableProvincesOf(s, Fleet)]
        .filter(p => !StandardRuleUtils.isSea(board.map, p))
        .forEach(p => {
          board.map.locationsOf(p).forEach(l => {
            if (l.militaryBranches.has(Army)) {
              locations.add(l)
            }
          })
        })
    })
    return new Set([...locations].filter(x => x.province !== unit.location.province))
  }
}

module.exports = StandardRuleUtils
