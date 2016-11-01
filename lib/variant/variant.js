const Helper = require('./helper')

module.exports = class Variant {
  constructor (season, phases, militaryBranches, orderClasses, map, initialBoard) {
    this.map = map
    this.season = new Set([...season])
    this.phases = new Set([...phases])
    this.militaryBranches = new Set([...militaryBranches])
    this.orderClasses = new Map([...orderClasses])
    this.initialBoard = initialBoard
  }
  helper () {
    if (!this._helper) {
      this._helper = new Helper(
        this.season, this.phases, this.militaryBranches, this.orderClasses, this.map
      )
    }
    return this._helper
  }
}
