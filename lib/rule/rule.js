const Replaced = require('./order-result').Replaced
const ResolvedResult = require('./resolved-result')

module.exports = class Rule {
  resolve (board, orders) {
    // Reject if one unit has several orders
    function eq (u1, u2) {
      return (u1.location === u2.location) && (u1.militaryBranch === u2.militaryBranch) && (u1.power === u2.power)
    }

    const unitsHaveSeveralOrders = new Set(
      [...orders].filter(order => {
        return [...orders].some(order2 => order !== order2 && eq(order.unit, order2.unit))
      }).map(order => order.unit)
    )
    if (unitsHaveSeveralOrders.size !== 0) {
      return { err: `${[...unitsHaveSeveralOrders].join(', ')}: several orders` }
    }

    const os = new Set([...orders])

    // Add a default orders if an unit requiring an order has no order
    this.unitsRequiringOrder(board).forEach(unit => {
      if ([...orders].every(o => !eq(o.unit, unit))) {
        os.add(this.defaultOrderOf(board, unit))
      }
    })

    // Replace from invalid orders to default orders
    const replaced = new Map()
    os.forEach(order => {
      const msg = this.errorMessageOfOrder(board, order)
      if (msg) {
        const replacedOrder = this.defaultOrderOf(board, order.unit)
        os.delete(order)
        os.add(replacedOrder)
        replaced.set(replacedOrder, [order, msg])
      }
    })

    const msg = this.errorMessageOfOrders(board, [...os])
    if (msg) {
      // Reject if the set of the orders is invalid
      return { err: msg }
    }

    const result = this.resolveProcedure(board, [...os])
    if (result.err) {
      return result
    }

    const newResults = result.result.results
    replaced.forEach((value, replacedOrder) => {
      const [order, message] = value
      const result = [...newResults].find(r => r.target === replacedOrder)
      newResults.delete(result)
      newResults.add(
        new Replaced(
          order, message, result.target, result.result
        )
      )
    })

    return { result: new ResolvedResult(result.result.board, newResults, result.result.isFinished) }
  }
}
