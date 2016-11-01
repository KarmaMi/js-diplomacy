const MapHelper = require('./map-helper')
const SystemHelper = require('./system-helper')

module.exports = class Helper {
  constructor (keywords, militaryBranches, orderClasses, map) {
    const systemHelper = new SystemHelper(keywords, militaryBranches, orderClasses)
    const mapHelper = new MapHelper(map)

    for (const key in systemHelper) {
      this[key] = systemHelper[key]
    }
    for (const key in mapHelper) {
      this[key] = mapHelper[key]
    }
  }
}
