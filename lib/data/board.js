module.exports = class Board {
  constructor (state, units, occupation, unitsStatus, provincesStatus) {
    this.state = state
    this.units = new Map([...units])
    this.occupation = new Map([...occupation])
    this.unitsStatus = new Map([...unitsStatus])
    this.provincesStatus = new Map([...provincesStatus])
  }

  numberOfsupplyCenters (force) {
    if (!this.occupation.has(force)) return null

    return [...this.occupation.get(force)].filter(elem => elem.isSupplyCenter).length
  }

  toString () {
    return this.state.toString()
  }
}
