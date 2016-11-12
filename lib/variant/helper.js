const MapHelper = require('../map/map-helper')
const RuleKeywordsHelper = require('../rule/rule-keywords-helper')

module.exports = class Helper {
  constructor (ruleKeywords, map) {
    const ruleKeywordsHelper = RuleKeywordsHelper(ruleKeywords)
    const mapHelper = MapHelper(map)

    for (const key in ruleKeywordsHelper) {
      this[key] = ruleKeywordsHelper[key]
    }
    for (const key in mapHelper) {
      this[key] = mapHelper[key]
    }
  }
}
