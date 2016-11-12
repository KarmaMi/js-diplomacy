const Helper = require('./helper')

module.exports = class Variant {
  constructor (ruleKeywords, rule, map, initialBoard) {
    this.ruleKeywords = ruleKeywords
    this.rule = rule
    this.map = map
    this.initialBoard = initialBoard
  }
  helper () {
    if (!this._helper) {
      this._helper = new Helper(this.ruleKeywords, this.map)
    }
    return this._helper
  }
}
