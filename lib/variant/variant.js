const Helper = require('./helper')

module.exports = class Variant {
  constructor (keywords, forces, militaryBranches, orderClasses, map, initialBoard) {
    this.map = map
    this.keywords = new Set([...keywords])
    this.forces = new Set([...forces])
    this.militaryBranches = new Set([...militaryBranches])
    this.orderClasses = new Map([...orderClasses])
    this.initialBoard = initialBoard
  }
  helper () {
    if (!this._helper) {
      this._helper = new Helper(
        this.keywords, this.forces, this.militaryBranches, this.orderClasses, this.map
      )
    }
    return this._helper
  }
}
