const Unit = require('../data/unit')

module.exports = class Helper {
  constructor (keywords, forces, militaryBranches, orderClasses, map) {
    keywords = new Set([...keywords])
    forces = new Set([...forces])
    militaryBranches = new Set([...militaryBranches])
    orderClasses = new Map([...orderClasses])

    /* Define helpers functions */
    // Define a helper for phases
    this.$f = {}
    forces.forEach(force => {
      this.$f[force.toString()] = force
    })
    // Define a helper for keywords
    this.$k = {}
    keywords.forEach(keyword => {
      this.$k[keyword.toString()] = keyword
      this[keyword.toString()] = keyword
    })

    // Define a helper for locations
    this.$l = {}
    map.locations.forEach(location => {
      this.$l[location.toString()] = location
      this[location.toString()] = location
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
