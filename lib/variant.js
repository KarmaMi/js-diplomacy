const Unit = require('./data/unit')

module.exports = class Variant {
  constructor (militaryBranches, keywords, orderClasses, map) {
    this.map = map

    /* Define helper functions */
    // Define a helper for keywords
    this.$$ = {}
    keywords.forEach(keyword => this.$$[keyword.abbreviatedName] = keyword)

    // Define a helper for locations
    this.map.provinces.forEach(province => {
      const self = this
      this.$$[province.abbreviatedName] = function () {
        return self.generateLocation(province, ...arguments)
      }
    })

    // Define a helper for units
    militaryBranches.forEach(elem => {
      this[elem.abbreviatedName] = (location) => {
        const unit = new Unit(elem, location)
        // Define orders
        orderClasses.forEach(order => {
          unit[order.name] = function () {
            return new order.Clazz(unit, ...arguments)
          }
        })

        return unit
      }
    })
  }
}
