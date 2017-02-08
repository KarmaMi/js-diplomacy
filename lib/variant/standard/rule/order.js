'use strict'

const BaseOrder = require('../../../rule/package').Order

/**
 * @classdesc Order of the standard rule
 * @extends rule.Order
 * @memberof variant.standard.rule.Order
 * @prop {!string} tpe - The type of the order
 */
class StandardOrder extends BaseOrder {
  /**
   * @constructor
   * @param {!board.Unit} unit - The unit that corresponds to this order.
   * @param {!string} tpe - The type of the order
   */
  constructor (unit, tpe) {
    super(unit)
    this.tpe = tpe
  }
}

/**
 * @classdesc Hold order
 * @extends variant.standard.rule.Order.StandardOrder
 * @memberof variant.standard.rule.Order
 */
class Hold extends StandardOrder {
  /**
   * @constructor
   * @param {!board.Unit} unit - The unit that corresponds to this order.
   */
  constructor (unit) {
    super(unit, 'Hold')
  }
  toString () {
    return `${this.unit} H`
  }
}
/**
 * @classdesc Move order
 * @extends variant.standard.rule.Order.StandardOrder
 * @memberof variant.standard.rule.Order
 * @prop {!board.Location} destination - The destination of this move order.
 * @prop {!boolean} useConvoy - The flag whether this move order uses convoy or not.
 */
class Move extends StandardOrder {
  /**
   * @constructor
   * @param {!board.Unit} unit - The unit that corresponds to this order.
   * @param {!board.Location} destination - The destination of this move order.
   * @param {boolean} [useConvoy=false] - The flag whether this move order uses convoy or not.
   */
  constructor (unit, destination, useConvoy) {
    super(unit, 'Move')
    this.destination = destination
    this.useConvoy = useConvoy || false
  }
  toString () {
    if (this.useConvoy) {
      return `${this.unit}-${this.destination} via Convoy`
    } else {
      return `${this.unit}-${this.destination}`
    }
  }
}
/**
 * @classdesc Support order
 * @extends variant.standard.rule.Order.StandardOrder
 * @memberof variant.standard.rule.Order
 * @prop {!(variant.standard.rule.Order.Move|variant.standard.rule.Order.Hold)} target -
 *   The target order of this support.
 * @prop {!board.Location} destination -
 *   The destination of this support order (the move destination or the location of the holded unit).
 */
class Support extends StandardOrder {
  /**
   * @constructor
   * @param {!board.Unit} unit - The unit that corresponds to this order.
   * @param {!(variant.standard.rule.Order.Move|variant.standard.rule.Order.Hold)} target -
   *   The target order of this support.
   */
  constructor (unit, target) {
    super(unit, 'Support')
    console.assert(target.tpe === 'Move' || target.tpe === 'Hold')

    this.target = target
    if (target.tpe === 'Move') {
      this.destination = target.destination
    } else {
      this.destination = target.unit.location
    }
  }
  toString () {
    return `${this.unit} S ${this.target}`
  }
}
/**
 * @classdesc Convoy order
 * @extends variant.standard.rule.Order.StandardOrder
 * @memberof variant.standard.rule.Order
 * @prop {!variant.standard.rule.Order.Move} target - The target order of this convoy.
 */
class Convoy extends StandardOrder {
  /**
   * @constructor
   * @param {!board.Unit} unit - The unit that corresponds to this order.
   * @param {!variant.standard.rule.Order.Move} target - The target order of this convoy.
   */
  constructor (unit, target) {
    super(unit, 'Convoy')
    console.assert(target.tpe === 'Move')

    this.target = target
  }
  toString () {
    return `${this.unit} C ${this.target}`
  }
}

/**
 * @classdesc Retreat order
 * @extends variant.standard.rule.Order.StandardOrder
 * @memberof variant.standard.rule.Order
 * @prop {!board.Location} destination - The destination of this retreat.
 */
class Retreat extends StandardOrder {
  /**
   * @constructor
   * @param {!board.Unit} unit - The unit that corresponds to this order.
   * @param {!board.Location} destination - The destination of this retreat.
   */
  constructor (unit, destination) {
    super(unit, 'Retreat')
    this.destination = destination
  }
  toString () {
    return `${this.unit} R ${this.destination}`
  }
}
/**
 * @classdesc Disband order
 * @extends variant.standard.rule.Order.StandardOrder
 * @memberof variant.standard.rule.Order
 */
class Disband extends StandardOrder {
  /**
   * @constructor
   * @param {!board.Unit} unit - The unit that corresponds to this order.
   */
  constructor (unit) {
    super(unit, 'Disband')
  }
  toString () {
    return `Disband ${this.unit}`
  }
}
/**
 * @classdesc Build order
 * @extends variant.standard.rule.Order.StandardOrder
 * @memberof variant.standard.rule.Order
 */
class Build extends StandardOrder {
  /**
   * @constructor
   * @param {!board.Unit} unit - The unit that corresponds to this order.
   */
  constructor (unit) {
    super(unit, 'Build')
  }
  toString () {
    return `Build ${this.unit}`
  }
}

/**
 * @namespace
 * @memberof variant.standard.rule
 */
const Order = {
  Hold: Hold,
  Move: Move,
  Support: Support,
  Convoy: Convoy,
  Retreat: Retreat,
  Disband: Disband,
  Build: Build
}

module.exports = Order
