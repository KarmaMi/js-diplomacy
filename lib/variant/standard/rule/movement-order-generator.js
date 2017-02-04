const { Hold } = require('./order')

module.exports = class MovementOrderGenerator {
  defaultOrderOf (board, unit) {
    return new Hold(unit)
  }

  ordersToSkipPhase (board) {
    if (board.units.size === 0) {
      return new Set()
    } else {
      return null
    }
  }
}
