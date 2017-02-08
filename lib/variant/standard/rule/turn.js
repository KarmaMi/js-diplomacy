'use strict'

/**
 * @classdesc Status of the {@link board.Province}
 * @memberof variant.standard.rule
 * @prop {!boolean} isBuildable - The flag whether there is a build phase in this turn.
 * @prop {!boolean} isOccupationUpdateable -
 *   The flag whether the occupation status is updated in this turn orNot.
 */
class Turn {
  /**
   * @constructor
   * @param {!boolean} isBuildable - The flag whether there is a build phase in this turn.
   * @param {!boolean} isOccupationUpdateable -
   *   The flag whether the occupation status is updated in this turn orNot.
   */
  constructor (isBuildable, isOccupationUpdateable) {
    this.isBuildable = isBuildable
    this.isOccupationUpdateable = isOccupationUpdateable
  }
}

module.exports = Turn
