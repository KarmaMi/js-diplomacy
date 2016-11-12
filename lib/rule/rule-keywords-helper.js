const Unit = require('../data/unit')

class RuleKeywordsHelper {
  constructor (ruleKeywords) {
    /* Define helpers functions */
    // Define a helper for seasons
    this.$s = {}
    ruleKeywords.seasons.forEach(s => {
      this.$s[s.toString()] = s
      this[s.toString()] = s
    })

    // Define a helper for phases
    this.$p = {}
    ruleKeywords.phases.forEach(phase => {
      this.$s[phase.toString()] = phase
      this[phase.toString()] = phase
    })

    // Define a helper for statuses
    this.$statuses = {}
    ruleKeywords.statuses.forEach(s => {
      this.$statuses[s.toString()] = s
      this[s.toString()] = s
    })

    // Define a helper for units
    this.$m = {}
    ruleKeywords.militaryBranches.forEach(elem => {
      const f = (location) => {
        if (!location) {
          return elem
        }

        const unit = new Unit(elem, location)
        // Define orders
        ruleKeywords.orders.forEach((Order, name) => {
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

const helper = Symbol('helper')
module.exports = function (ruleKeywords) {
  if (!ruleKeywords[helper]) {
    ruleKeywords[helper] = new RuleKeywordsHelper(ruleKeywords)
  }

  return ruleKeywords[helper]
}
