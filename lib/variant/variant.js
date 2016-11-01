const Helper = require('./helper')

module.exports = class Variant {
  constructor (keywords, militaryBranches, orderClasses, map, initialBoard) {
    this.map = map
    this.keywords = new Set([...keywords])
    this.militaryBranches = new Set([...militaryBranches])
    this.orderClasses = new Map([...orderClasses])
    this.initialBoard = initialBoard
  }
  helper () {
    if (!this._helper) {
      this._helper = new Helper(
        this.keywords, this.militaryBranches, this.orderClasses, this.map
      )
    }
    return this._helper
  }
}
