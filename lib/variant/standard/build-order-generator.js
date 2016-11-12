const OrderGenerator = require('./order-generator')

const ruleKeywords = require('./rule-keywords')
const Disband = ruleKeywords.orders.get('disband')

module.exports = class BuildOrderGenerator extends OrderGenerator {
  getOrdersToSkipPhase (map, board) {
    let canSkip = true
    const orders = []
    const forces = new Set([...board.units.keys()].concat([...board.occupation.keys()]))

    forces.forEach(force => {
      const numOfUnits = [...(board.units.get(force) || [])].length
      const numOfSupply = board.numberOfsupplyCenters(force)
      if (numOfUnits !== numOfSupply && numOfSupply !== 0) canSkip = false

      if (numOfSupply === 0) {
        (board.units.get(force) || []).forEach(unit => orders.push(new Disband(unit)))
      }
    })

    if (canSkip) return orders

    return null
  }
}
