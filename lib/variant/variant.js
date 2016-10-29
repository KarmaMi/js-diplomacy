const Unit = require('./../data/unit')

module.exports = class Variant {
  constructor (keywordsForState, forces, militaryBranches, keywords, orderClasses, map) {
    this.map = map

    /* Define helpers functions */
    // Define a helper for state
    this.$s = {}
    keywordsForState.forEach(key => {
      this.$s[key] = key
      this[key] = key
    })
    // Define a helper for phases
    this.$f = {}
    forces.forEach(force => {
      this.$s[force] = force
      this[force] = force
    })
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
      this.$p[province.name.abbreviatedName] = f
      this[province.name.abbreviatedName] = f
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
