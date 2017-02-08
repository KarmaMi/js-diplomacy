'use strict'

/**
 * @namespace
 * @member variant.standard
 */
const map = {
  province: require('./province'),
  /**
  * Defines locations of the Diplomacy standard map
  * @type {!Object}
  */
  location: require('./location'),
  /**
   * The stnadard map
   * @type {!board.DiplomacyMap}
   */
  map: require('./map'),
  Power: require('./power')
}


module.exports = map
