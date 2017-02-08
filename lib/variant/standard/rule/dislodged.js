'use strict'

/**
 * @classdesc Status that an unit is dislodged
 * @memberof variant.standard.rule
 * @prop {!board.Province} attackedFrom - The province that the unit is attacked from
 */
class Dislodged {
  /**
   * @constructor
   * @param {!board.Province} attackedFrom - The province that the unit is attacked from
   */
  constructor (attackedFrom) {
    this.attackedFrom = attackedFrom
  }
}

module.exports = Dislodged
