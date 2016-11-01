const Unit = require('../data/unit')

module.exports = class RuleHelper {
  constructor (season, phases, militaryBranches, orderClasses) {
    season = new Set([...season])
    phases = new Set([...phases])
    militaryBranches = new Set([...militaryBranches])
    orderClasses = new Map([...orderClasses])

    /* Define helpers functions */
    // Define a helper for season
    this.$s = {}
    season.forEach(s => {
      this.$s[s.toString()] = s
      this[s.toString()] = s
    })

    // Define a helper for phases
    this.$p = {}
    phases.forEach(phase => {
      this.$s[phase.toString()] = phase
      this[phase.toString()] = phase
    })

    // Define a helper for units
    this.$m = {}
    militaryBranches.forEach(elem => {
      const f = (location) => {
        const unit = new Unit(elem, location)
        // Define orders
        orderClasses.forEach((Order, name) => {
          unit[name] = function () {
            return new Order(unit, ...arguments)
          }
        })
        return unit
      }
      this.$m[elem.toString()] = f
      this[elem.toString()] = f
    })
  }
}
