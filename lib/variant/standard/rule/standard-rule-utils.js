'use strict'

const { Fleet } = require('./military-branch')

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
}

module.exports = StandardRuleUtils
