const MapHelper = require('./map-helper')
const SystemHelper = require('./system-helper')

module.exports = class Helper {
  constructor (keywords, forces, militaryBranches, orderClasses, map) {
    const systemHelper = new SystemHelper(keywords, militaryBranches, orderClasses)
    const mapHelper = new MapHelper(forces, map)

    for (const key in systemHelper) {
      this[key] = systemHelper[key]
    }
    for (const key in mapHelper) {
      this[key] = mapHelper[key]
    }
  }
}
