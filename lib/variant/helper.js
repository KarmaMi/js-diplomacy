const MapHelper = require('../map/map-helper')
const RuleHelper = require('../rule/rule-helper')

module.exports = class Helper {
  constructor (season, phases, militaryBranches, orderClasses, map) {
    const systemHelper = new RuleHelper(season, phases, militaryBranches, orderClasses)
    const mapHelper = new MapHelper(map)

    for (const key in systemHelper) {
      this[key] = systemHelper[key]
    }
    for (const key in mapHelper) {
      this[key] = mapHelper[key]
    }
  }
}
