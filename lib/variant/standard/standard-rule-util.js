const RuleHelper = require('../../rule/rule-helper')
const State = require('../../data/state')
const Board = require('../../data/board')

module.exports = class StandardRuleUtil {
  static getDestinationOfSupportOrder (support) {
    return (support.target.type === 'Hold')
      ? support.target.unit.location
      : support.target.destination
  }

  static getNewBoard (rule, board, nextUnits, nextUnitsStatus, nextProvincesStatus) {
    const $ = RuleHelper(rule)

    const nextOccupation =
      (board.state.season === $.Autumn)
        ? StandardRuleUtil.updateOccupation(nextUnits, board.occupation)
        : board.occupation

    const nextState = StandardRuleUtil.getNextState(rule, board.state)

    return new Board(nextState, nextUnits, nextOccupation, nextUnitsStatus, nextProvincesStatus)
  }

  static updateOccupation (units, occupation) {
    const provinceToForce = new Map()
    occupation.forEach((provinces, force) => {
      provinces.forEach(province => provinceToForce.set(province, force))
    })

    const newOccupation = new Map([...occupation])

    function addProvince (p, f) {
      if (newOccupation.has(f)) {
        newOccupation.get(f).push(p)
      } else {
        newOccupation.set(f, [p])
      }
    }
    function deleteProvince (p) {
      if (provinceToForce.has(p)) {
        const force = provinceToForce.get(p)
        const ps = new Set([...newOccupation.get(force)] || [])
        ps.delete(p)
        newOccupation.set(force, [...ps])
      }
    }
    units.forEach((units, force) => {
      units.forEach(unit => {
        deleteProvince(unit.location.province)
        addProvince(unit.location.province, force)
      })
    })

    return newOccupation
  }

  static existsUnitInProvince (board, province) {
    return [...board.units].some(elem => {
      return elem[1].some(unit => unit.location.province === province)
    })
  }

  static existsUnit (board, unit) {
    return [...board.units].some(elem => {
      return elem[1].some(e => {
        return e.location === unit.location && e.militaryBranch === unit.militaryBranch
      })
    })
  }

  static getForceOfUnit (board, unit) {
    const x = [...board.units].find(x => {
      const units = x[1]
      return units.some(u => {
        return u.militaryBranch === unit.militaryBranch &&
          u.location === unit.location
      })
    })

    return (x) ? x[0] : x
  }

  static getNextState (rule, state) {
    const $ = RuleHelper(rule)

    switch (state.phase) {
      case $.Movement: return new State(state.year, state.season, $.Retreat)
      case $.Retreat:
        if (state.season === $.Autumn) {
          return new State(state.year, state.season, $.Build)
        } else {
          return new State(state.year, $.Autumn, $.Movement)
        }
      case $.Build: return new State(state.year + 1, $.Spring, $.Movement)
    }
  }

  static locationsCanBeRetreated (rule, map, board, unit, attackedFrom) {
    const $ = RuleHelper(rule)

    return [...map.canMoveTo(unit)].filter(location => {
      if (board.provincesStatus.get(location.province) === $.Standoff) {
        return false
      } else if (location.province === attackedFrom) {
        return false
      } else if (StandardRuleUtil.existsUnitInProvince(board, location.province)) {
        return false
      } else {
        return true
      }
    })
  }
}
