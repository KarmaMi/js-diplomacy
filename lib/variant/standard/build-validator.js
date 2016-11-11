const Validator = require('./validator')
const StandardRuleUtil = require('./standard-rule-util')

module.exports = class BuildResolver extends Validator {
  constructor (rule) {
    super()

    this.rule = rule
  }

  getErrorMessageForOrder (map, board, order) {
    let force = null
    switch (order.type) {
      case 'Build':
        if (StandardRuleUtil.existsUnitInProvince(board, order.unit.location.province)) {
          return `An unit is in ${order.unit.location.province.name}.`
        }
        if (!order.unit.location.province.homeOf) {
          return `${order.unit.location.province.name} is not home country of any forces.`
        }
        if (!order.unit.location.province.isSupplyCenter) {
          return `${order.unit.location.province.name} is not supply center.`
        }
        force = order.unit.location.province.homeOf
        if (!new Set([...(board.occupation.get(force) || [])]).has(order.unit.location.province)) {
          return `${order.unit.location.province.name} is not occupied by ${force}.`
        }
        return null
      case 'Disband':
        if (!StandardRuleUtil.existsUnit(board, order.unit)) {
          return `${order.unit} does not exists.`
        }
        force = StandardRuleUtil.getForceOfUnit(board, order.unit)

        const numOfUnits = [...(board.units.get(force) || [])].length
        const numOfSupplys = board.numberOfsupplyCenters(force)

        if (numOfUnits <= numOfSupplys) {
          return `${force} has sufficient supply centers.`
        }
        return null
    }

    throw 'This method is not implemented yet.'
  }

  getErrorMessageForOrders (map, board, orders) {
    const forceToUnit = new Map()

    board.units.forEach((units, force) => forceToUnit.set(force, units.length))
    orders.forEach(order => {
      const force = (order.type === 'Build')
        ? order.unit.location.province.homeOf
        : StandardRuleUtil.getForceOfUnit(board, order.unit)
      const diff = (order.type === 'Build') ? 1 : -1

      forceToUnit.set(force, (forceToUnit.get(force) || 0) + diff)
    })

    for (const elem of [...forceToUnit]) {
      const [force, numOfUnit] = elem
      const numOfSupplys = board.numberOfsupplyCenters(force)

      if (numOfUnit > numOfSupplys) {
        return `${force} does not have sufficient supply centers.`
      }
    }

    return null
  }

  defaultOrder (map, board, unit) {
    return null
  }
}
