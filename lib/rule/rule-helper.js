const Unit = require('../data/unit')

module.exports = class RuleHelper {
  constructor (rule) {
    /* Define helpers functions */
    // Define a helper for seasons
    this.$s = {}
    rule.seasons.forEach(s => {
      this.$s[s.toString()] = s
      this[s.toString()] = s
    })

    // Define a helper for phases
    this.$p = {}
    rule.phases.forEach(phase => {
      this.$s[phase.toString()] = phase
      this[phase.toString()] = phase
    })

    // Define a helper for statuses
    this.$statuses = {}
    rule.statuses.forEach(s => {
      this.$statuses[s.toString()] = s
      this[s.toString()] = s
    })

    // Define a helper for units
    this.$m = {}
    rule.militaryBranches.forEach(elem => {
      const f = (location) => {
        if (!location) {
          return elem
        }

        const unit = new Unit(elem, location)
        // Define orders
        rule.orders.forEach((Order, name) => {
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