const Helper = require('./helper')

module.exports = class Variant {
  constructor (rule, map, initialBoard) {
    this.map = map
    this.rule = rule
    this.initialBoard = initialBoard
  }
  helper () {
    if (!this._helper) {
      this._helper = new Helper(this.rule, this.map)
    }
    return this._helper
  }
}
