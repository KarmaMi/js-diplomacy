const { Army, Fleet } = require('./military-branch')
const StandardRuleUtils = require('./standard-rule-utils')

function isReachableViaSea (map, unit, location) {
  const visited = new Set()
  function dfs (province) {
    visited.add(province)
    return [...map.movableProvincesOf(province, Fleet)].filter(next => {
      return !visited.has(next)
    }).some(next => {
      const isSea = StandardRuleUtils.isSea(map, next)
      if (next === location) {
        return true
      } else if (isSea) {
        visited.add(next)
        return dfs(next)
      } else {
        false
      }
    })
  }
  return dfs(unit.location.province)
}

module.exports = class MovementValidator {
  unitsRequiringOrder (board) {
    return board.units
  }
  errorMessageOfOrder (board, order) {
    // The order is invalid if order.unit is not in board.
    if ([...board.units].every(unit => {
      return (unit.militaryBranch !== order.unit.militaryBranch) ||
        (unit.location !== order.unit.location) ||
        (unit.power !== order.unit.power)
    })) {
      return `${order.unit} does not exist`
    }

    switch (order.tpe) {
      case 'Hold':
        break
      case 'Move':
        /*
        Move is valid if
        1. the unit can move to the destination or
        2. the unit is army, the location is coast, and the fleet can move to destination from the location.
        */
        if (
          board.map.movableLocationsOf(
            order.unit.location, order.unit.militaryBranch
          ).has(order.destination)
        ) {
          return null
        } else if (
          (order.unit.militaryBranch === Army) &&
          isReachableViaSea(board.map, order.unit, order.destination.province)
        ) {
          return null
        } else {
          return `${order.unit} cannot move to ${order.destination}`
        }
      case 'Support':
        // Support is valid if the destination can be moved.
        const msgForTarget = this.errorMessageOfOrder(board, order.target)
        if (msgForTarget) {
          return msgForTarget
        } else {
          if (
            board.map.movableLocationsOf(order.unit.location, order.unit.militaryBranch).has(order.destination)
          ) {
            return null
          } else {
            return `${order.unit} cannot support ${order.target}`
          }
        }
      case 'Convoy':
        /*
        Convoy is valid if
        1. the unit is fleet,
        2. the target is move order,
        3. the target is army,
        4. the location is sea, and
        5. the destination can be moved from the unit's location
        */
        const msg = this.errorMessageOfOrder(board, order.target)
        if (msg) {
          return msgForTarget
        } else {
          if (order.unit.militaryBranch !== Fleet) {
            return `${order.unit} is not fleet`
          } else if (order.target.unit.militaryBranch !== Army) {
            return `${order.target.unit} is not army`
          } else {
            const isSea = StandardRuleUtils.isSea(board.map, order.unit.location.province)
            if (!isSea) {
              return `${order.unit} is not on sea`
            } else if (!isReachableViaSea(board.map, order.target.unit, order.target.destination.province)) {
              return `Moving from ${order.target.unit.location} to ${order.target.destination} via convoy is invalid`
            } else if (!isReachableViaSea(board.map, order.unit, order.target.destination.province)) {
              return `Moving from ${order.unit.location} to ${order.target.destination} via convoy is invalid`
            }
          }
        }
        break
      default:
        return `${order} is not for Movement phase`
    }
    return null
  }
  errorMessageOfOrders (board, orders) {
    return null
  }
}
