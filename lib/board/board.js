module.exports = class Board {
  constructor (map, state, units, unitStatuses, provinceStatuses) {
    this.map = map
    this.state = state
    this.units = new Set([...units])
    this.unitStatuses = new Map([...unitStatuses])
    this.provinceStatuses = new Map([...provinceStatuses])
  }
}
