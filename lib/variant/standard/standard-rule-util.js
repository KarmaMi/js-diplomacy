const RuleHelper = require('../../rule/rule-helper')
const State = require('../../data/state')

module.exports = class StandardRuleUtil {
  static getDestinationOfSupportOrder (support) {
    return (support.target.type === 'Hold')
      ? support.target.unit.location
      : support.target.destination
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
        newOccupation.set(force, ps)
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

  static isBuildPhaseRequired (units, occupation) {
    let required = false
    units.forEach((units, force) => {
      const numOfUnit = [...units].length
      const numOfSupply = occupation.has(force) ? [...occupation.get(force)].length : 0

      if (numOfUnit !== numOfSupply) required = true
    })
    return required
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
  static getNextState (rule, state, units, occupation, unitStatuses) {
    const $ = new RuleHelper(rule)

    const existDislodgedUnits = [...unitStatuses].some(x => {
      return [...x[1]].some(y => {
        const status = y[1]
        return status.status === $.Dislodged
      })
    })
    if (state.season === $.Autumn) {
      if (existDislodgedUnits) {
        return new State(state.year, state.season, $.Retreat)
      } else if (StandardRuleUtil.isBuildPhaseRequired(units, occupation)) {
        return new State(state.year, state.season, $.Build)
      } else {
        return new State(state.year + 1, $.Spring, $.Movement)
      }
    } else {
      if (existDislodgedUnits) {
        return new State(state.year, state.season, $.Retreat)
      } else {
        return new State(state.year, $.Autumn, $.Movement)
      }
    }
  }
}
