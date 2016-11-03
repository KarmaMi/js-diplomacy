module.exports = class Rule {
  constructor (season, phases, statuses, militaryBranches, orders) {
    this.season = new Set([...season])
    this.phases = new Set([...phases])
    this.statuses = new Set([...statuses])
    this.militaryBranches = new Set([...militaryBranches])
    this.orders = new Map([...orders])
  }

  resolve (map, board, orders) {
    const units = []
    // Reject if one unit has several orders
    function eq (u1, u2) {
      return u1.militaryBranch === u2.militaryBranch && u1.location === u2.location
    }
    for (const order of [...orders]) {
      if (units.some(unit => eq(unit, order.unit))) {
        return null
      }
      units.push(order.unit)
    }

    // Replace from invalid orders to default orders
    const os = [...orders].map(order => {
      return (this.validateOrder(map, board, order))
        ? order
        : this.defaultOrder(map, board, order.unit)
    }).filter(elem => elem !== null && elem !== undefined)

    return this._resolveOrder(map, board, os)
  }

  _resolveOrder (map, board, os) {
    throw 'This method is not implemented yet.'
  }

  getErrorMessageForOrder (map, board, order) {
    throw 'This method is not implemented yet.'
  }

  validateOrder (map, board, order) {
    return !(this.getErrorMessageForOrder(map, board, order))
  }

  defaultOrder (map, board, unit) {
    throw 'This method is not implemented yet.'
  }
}
