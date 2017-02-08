'use strict'

const BaseTurn = require('./../rule/package').Turn
const { Spring, Autumn } = require('./season')

/**
 * @classdesc The turn of standard Diplomacy rule
 * @extends variant.standard.rule.Turn
 * @memberof variant.standard.board
 * @prop {!number} year -
 * @prop {!string} season - See {@link variant.standard.board.Season}.
 */
class Turn extends BaseTurn {
  /**
   * @constructor
   * @param {!number} year -
   * @param {!string} season - See {@link variant.standard.board.Season}.
   */
  constructor (year, season) {
    super(season === Autumn, season === Autumn)
    this.year = year
    this.season = season
  }
  /**
   * @return {!variant.standard.board.Turn} -
   *   The next turn (For example, 1901 Autumn if this instance represents 1901 Spring)
   */
  nextTurn () {
    if (this.season === Autumn) {
      return new Turn(this.year + 1, Spring)
    } else {
      return new Turn(this.year, Autumn)
    }
  }
}

module.exports = Turn
