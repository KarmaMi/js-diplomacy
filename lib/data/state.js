module.exports = class State {
  constructor (year, season, phase) {
    this.year = year
    this.season = season
    this.phase = phase
  }

  toString () {
    return `${this.year}-${this.season}(${this.phase})`
  }
}
