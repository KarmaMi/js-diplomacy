'use strict'

/**
 * @classdesc Variant of Diplomacy
 * @memberof variant
 * @prop {!rule.Rule} rule - The rule used in this variant.
 * @prop {!board.Board} initialBoard - The initial state of the board used in this variant.
 */
class Variant {
  /**
   * @constructor
   * @param {!rule.Rule} rule - The rule used in this variant.
   * @param {!board.Board} initialBoard - The initial state of the board used in this variant.
   */
  constructor (rule, initialBoard) {
    this.rule = rule
    this.initialBoard = initialBoard
  }
}

module.exports = Variant
