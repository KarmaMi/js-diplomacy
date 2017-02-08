'use strict'

/**
 * @namespace
 * @memberof variant
 */
const standard = {
  map: require('./map/package'),
  board: require('./board/package'),
  rule: require('./rule/package'),
  /**
   * The standard variant (uses the standard map and the standard mape).
   * @type {!variant.Variant}
   */
  variant: require('./variant')
}

module.exports = standard
