'use strict'

/**
 * @classdesc Status of the {@link board.Province}
 * @memberof variant.standard.rule
 * @prop {!variant.standard.rule.State} turn -
 * @prop {!variant.standard.rule.Phase} phase -
 */
class State {
  /**
   * @constructor
   * @param {!variant.standard.rule.State} turn -
   * @param {!variant.standard.rule.Phase} phase -
   */
  constructor (turn, phase) {
    this.turn = turn
    this.phase = phase
  }
}

module.exports = State
