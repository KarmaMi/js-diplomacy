const Result = require('./result')
const { Fleet } = require('./military-branch')

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
    function canMoveViaConvoy (unit, destination, provinces) {
      const provinceBuffer = new Set([...provinces])
      function dfs (current) {
        let retval = false
        for (let next of [...map.movableProvincesOf(current, Fleet)]) {
          if (next === destination) {
            retval = true
            break
          } else if (provinceBuffer.has(next)) {
            provinceBuffer.delete(next)
            if (dfs(next)) {
              retval = true
              break
            }
          }
        }
        return retval
      }
      let retval = false
      for (let next of map.movableProvincesOf(unit.location.province, Fleet)) {
        if (provinceBuffer.has(next)) {
          provinceBuffer.delete(next)
          if (dfs(next)) {
            retval = true
            break
          }
        }
      }
      return retval
    }

    const provinces = [...this.relatedOrders].filter(order => {
      return (order.order.tpe === 'Convoy') &&
        ((order.getResult() === Result.Failed) || (order.getResult() === Result.Success))
    }).map(order => order.order.unit.location.province)

    if (canMoveViaConvoy(this.target.order.unit, this.target.order.destination.province, provinces)) {
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
