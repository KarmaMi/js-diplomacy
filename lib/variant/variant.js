const Unit = require('./../data/unit')

module.exports = class Variant {
  constructor (militaryBranches, keywords, orderClasses, map) {
    this.map = map

    /* Define helper functions */
    // Define a helper for keywords
    this.$k = {}
    keywords.forEach(keyword => {
      this.$k[keyword.abbreviatedName] = keyword
      this[keyword.abbreviatedName] = keyword
    })

    // Define a helper for locations
    this.$p = {}
    this.map.provinces.forEach(province => {
      const self = this
      const f = function () { return self.generateLocation(province, ...arguments) }
      this.$p[province.abbreviatedName] = f
      this[province.abbreviatedName] = f
    })

    // Define a helper for units
    this.$m = {}
    militaryBranches.forEach(elem => {
      const f = (location) => {
        const unit = new Unit(elem, location)
        // Define orders
        orderClasses.forEach(order => {
          unit[order.name] = function () {
            return new order.Clazz(unit, ...arguments)
          }
        })
        return unit
      }
      this.$m[elem.abbreviatedName] = f
      this[elem.abbreviatedName] = f
    })
  }
}
