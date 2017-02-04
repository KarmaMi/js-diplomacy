module.exports = class Province {
  constructor (name, homeOf, isSupplyCenter) {
    this.name = name
    this.homeOf = homeOf
    this.isSupplyCenter = isSupplyCenter || false
  }

  toString () {
    if (this.isSupplyCenter) {
      return `${this.name}*`
    } else {
      return this.name.toString()
    }
  }
}
