const Unit = require('../data/unit')

module.exports = class RuleHelper {
  constructor (rule) {
    /* Define helpers functions */
    // Define a helper for season
    this.$s = {}
    rule.season.forEach(s => {
      this.$s[s.toString()] = s
      this[s.toString()] = s
    })

    // Define a helper for phases
    this.$p = {}
    rule.phases.forEach(phase => {
      this.$s[phase.toString()] = phase
      this[phase.toString()] = phase
    })

    // Define a helper for units
    this.$m = {}
    rule.militaryBranches.forEach(elem => {
      const f = (location) => {
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
