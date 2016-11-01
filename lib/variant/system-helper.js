const Unit = require('../data/unit')

module.exports = class SystemHelper {
  constructor (keywords, militaryBranches, orderClasses) {
    keywords = new Set([...keywords])
    militaryBranches = new Set([...militaryBranches])
    orderClasses = new Map([...orderClasses])

    /* Define helpers functions */
    // Define a helper for keywords
    this.$k = {}
    keywords.forEach(keyword => {
      this.$k[keyword.toString()] = keyword
      this[keyword.toString()] = keyword
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
