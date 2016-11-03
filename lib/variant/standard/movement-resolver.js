const Unit = require('../../data/unit')
const Resolver = require('./resolver')

module.exports = class MovementResolver extends Resolver {
  constructor (rule) {
    super(rule)

    this.Fleet = [...this.rule.militaryBranches].find(elem => {
      return elem.name === 'Fleet' && elem.abbreviatedName === 'F'
    })
  }
  resolve (map, board, orders) {
    // Generate the dependency graph
    // Merge the graph
    // Resolve each province
    throw 'This method is not implemented yet.'
  }

  getErrorMessageForOrder (map, board, order) {
    // The order is invalid if order.unit is not in board.
    let exists = false
    board.units.forEach(units => units.forEach(unit => {
      if (unit.militaryBranch === order.unit.militaryBranch && unit.location === order.unit.location) {
        exists = true
      }
    }))
    if (!exists) return `${order.unit} does not exist.`

    let targetMsg = null
    switch (order.type) {
      case 'Hold':
        // Hold is always valid
        return null
      case 'Move':
        /*
        Move is valid if
        1. the unit can move to the destination or
        2. the unit is army, the location is coast, and the fleet can move to destination from the location.
        */
        if (map.canMoveTo(order.unit).has(order.destination)) {
          return null
        }
        if (
          order.unit.militaryBranch !== this.Fleet && // The unit is army
          order.unit.location.militaryBranches.size === 2 && // The location is coast
          this.isReachableViaSea(map, order.unit, order.destination.province)
        ) {
          return null
        }
        return `${order.unit} cannot move to ${order.destination}.`
      case 'Support':
        // Support is valid if the destination can be moved.
        targetMsg = this.getErrorMessageForOrder(map, board, order.target)
        if (targetMsg) return targetMsg

        if (order.target.type !== 'Hold' && order.target.type !== 'Move') {
          return `${order.target} cannot be a target of Support order.`
        }

        const destination = (order.target.type === 'Hold')
          ? order.target.unit.location
          : order.target.destination
        return map.canMoveTo(order.unit).has(destination)
          ? null
          : `${order.unit} cannot support ${order.target}.`
      case 'Convoy':
        /*
        Convoy is valid if
        1. the unit is fleet,
        2. the target is move order,
        3. the target is army,
        4. the location is sea, and
        5. the destination can be moved from the unit's location
        */
        targetMsg = this.getErrorMessageForOrder(map, board, order.target)
        if (targetMsg) return targetMsg

        if (order.unit.militaryBranch !== this.Fleet) {
          return `${order.unit} is not fleet.`
        }
        if (order.target.type !== 'Move') {
          return `${order.target} cannot be a target of Convoy order.`
        }
        if (order.target.unit.militaryBranch === this.Fleet) {
          return `${order.target.unit} is not army.`
        }
        if (!this.isSea(order.unit.location)) {
          return `${order.unit} is not on sea.`
        }
        if (!this.isReachableViaSea(map, order.unit, order.target.destination.province)) {
          return `Moving from ${order.target.unit.location} to ${order.target.destination} via convoy is invalid`
        }
        return null
    }

    throw 'This method is not implemented yet.'
  }

  defaultOrder (map, board, unit) {
    const Hold = this.rule.orders.get('hold')
    return new Hold(unit)
  }

  isSea (location) {
    return location.militaryBranches.size === 1 && [...location.militaryBranches][0] === this.Fleet
  }

  isReachableViaSea (map, unit, province) {
    const visited = new Set()
    const dfs = (location) => {
      visited.add(location.province)
      let reachable = false
      for (const next of [...map.canMoveTo(new Unit(this.Fleet, location))]) {
        if (visited.has(next.province)) {
          // Already visited
          continue
        }

        if (next.province === province) {
          reachable = true
          break
        }

        if (!this.isSea(next)) {
          continue
        }

        visited.add(next.province)
        if (dfs(next, new Set([...visited]))) {
          reachable = true
          break
        }
      }
      return reachable
    }

    return dfs(unit.location)
  }
}