module.exports = class Rule {
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

    // Add a default orders if an unit requiring order has no order
    this.getUnitsRequiringOrder(map, board).forEach(unit => {
      if ([...orders].every(order => !eq(order.unit, unit))) {
        orders.push(this.defaultOrder(map, board, unit))
      }
    })

    // Replace from invalid orders to default orders
    const replaced = new Map()
    const os = []
    orders.forEach(order => {
      if (this.validateOrder(map, board, order)) {
        os.push(order)
      } else {
        const defaultOrder = this.defaultOrder(map, board, order.unit)
        if (!defaultOrder) return
        replaced.set(defaultOrder, order)
        os.push(defaultOrder)
      }
    })

    // Reject if the set of the orders is invalid
    if (this.getErrorMessageForOrders(map, board, os)) return null

    const result = this._resolveOrder(map, board, os)
    if (!result) return result

    const { board: board2, orderResult } = result

    const orderResult2 = new Map()
    new Map([...orderResult]).forEach((result, order) => {
      if (replaced.has(order)) {
        orderResult2.set(replaced.get(order), { replacedBy: order, result: result })
      } else {
        orderResult2.set(order, result)
      }
    })

    return { board: board2, orderResult: orderResult2 }
  }

  _resolveOrder (map, board, os) {
    throw 'This method is not implemented yet.'
  }

  getUnitsRequiringOrder (map, board) {
    throw 'This method is not implemented yet.'
  }

  getErrorMessageForOrder (map, board, order) {
    throw 'This method is not implemented yet.'
  }

  getErrorMessageForOrders (map, board, orders) {
    throw 'This method is not implemented yet.'
  }

  validateOrder (map, board, order) {
    return !(this.getErrorMessageForOrder(map, board, order))
  }

  defaultOrder (map, board, unit) {
    throw 'This method is not implemented yet.'
  }
}
