'use strict'

/**
 * @classdesc
 * @memberof rule
 * @prop {!board.Board} board
 * @prop {!Set.<(rule.OrderResult.Executed|rule.OrderResult.Replaced)>} results -
 *   The set of order results
 * @prop {!boolean} isFinished - The flag whether this game is finished or not.
 */
class ResolvedResult {
  /**
   * @constructor
   * @param {!board.Board} board
   * @param {!Set.<(rule.OrderResult.Executed|rule.OrderResult.Replaced)>} results -
   *   The set of order results
   * @param {!boolean} isFinished - The flag whether this game is finished or not.
   */
  constructor (board, results, isFinished) {
    this.board = board
    this.results = new Set([...results])
    this.isFinished = isFinished
  }
}

module.exports = ResolvedResult
