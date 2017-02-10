const Result = require('./result')
const { Fleet } = require('./military-branch')
const StandardRuleUtils = require('./standard-rule-utils')

module.exports = class MovementOrderGroup {
  constructor (target, relatedOrders) {
    this.target = target
    this.relatedOrders = new Set([...relatedOrders])
  }
  validSupports () {
    return new Set(
      [...this.relatedOrders].filter(order => {
        return (order.order.tpe === 'Support') &&
          (order.getResult() !== Result.Dislodged) && (order.getResult() !== Result.Cut) &&
          (order.getResult() !== Result.NoCorrespondingOrder)
      }).map(order => order.order)
    )
  }

  power () {
    return 1 + this.validSupports().size
  }

  route (map) {
    if (this.target.order.tpe !== 'Move') {
      return null
    }
    const units = [...this.relatedOrders].filter(order => {
      return (order.order.tpe === 'Convoy') &&
        ((order.getResult() === Result.Failed) || (order.getResult() === Result.Success))
    }).map(order => order.order.unit)

    if (
      StandardRuleUtils.isMovableViaSea(
        map, this.target.order.unit.location.province, this.target.order.destination.province,
        units
      )
    ) {
      return { viaConvoy: true }
    } else if (
      map.movableLocationsOf(this.target.order.unit.location, this.target.order.unit.militaryBranch).has(this.target.order.destination)
    ) {
      return { viaConvoy: false }
    } else {
      return null
    }
  }
}
