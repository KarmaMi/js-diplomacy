const BaseTurn = require('./../rule/package').Turn
const { Spring, Autumn } = require('./season')

module.exports = class Turn extends BaseTurn {
  constructor (year, season) {
    super(season === Autumn, season === Autumn)
    this.year = year
    this.season = season
  }
  nextTurn () {
    if (this.season === Autumn) {
      return new Turn(this.year + 1, Spring)
    } else {
      return new Turn(this.year, Autumn)
    }
  }
}
