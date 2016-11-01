const MapHelper = require('../map/map-helper')
const RuleHelper = require('../rule/rule-helper')

module.exports = class Helper {
  constructor (rule, map) {
    const ruleHelper = new RuleHelper(rule)
    const mapHelper = new MapHelper(map)

    for (const key in ruleHelper) {
      this[key] = ruleHelper[key]
    }
    for (const key in mapHelper) {
      this[key] = mapHelper[key]
    }
  }
}
