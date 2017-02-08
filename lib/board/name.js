'use strict'

/**
 * @classdesc Name of atomic components (e.g., provinces)
 * @prop {!string} name - The name (e.g., London)
 * @prop {!string} abbreviatedName - The abbreviated name (e.g., Lon)
 * @memberof board
 */
class Name {
  /**
   * @constructor
   * @param {!string} name - The name
   * @param {string} [abbreviatedName] -
   *   The abbreviated name. name is used if this param is not specified.
   */
  constructor (name, abbreviatedName) {
    this.name = name
    this.abbreviatedName = abbreviatedName || name
  }
  toString () {
    return this.abbreviatedName
  }
}
module.exports = Name
