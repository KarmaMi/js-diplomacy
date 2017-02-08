'use strict'

const { Name } = require('../../../board/package')

/**
 * Defines military branches
 * @namespace
 * @memberof variant.standard.rule
 */
const MilitaryBranch = {
  /**
   * Army
   * @type {!board.Name}
   */
  Army: new Name('Army', 'A'),
  /**
   * Fleet
   * @type {!board.Name}
   */
  Fleet: new Name('Fleet', 'F')
}

module.exports = MilitaryBranch
