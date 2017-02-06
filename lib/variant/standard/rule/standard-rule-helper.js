const { Unit } = require('../../../board/package')
const { Army, Fleet } = require('./military-branch')
const Order = require('./order')
const Phase = require('./phase')

class UnitForStandardRule {
  constructor (unit) {
    this.unit = unit
  }

  hold () {
    return new Order.Hold(this.unit)
  }
  move (destination) {
    return new Order.Move(this.unit, destination)
  }
  moveViaConvoy (destination) {
    return new Order.Move(this.unit, destination, true)
  }
  support (target) {
    return new Order.Support(this.unit, target)
  }
  convoy (target) {
    return new Order.Convoy(this.unit, target)
  }

  retreat (destination) {
    return new Order.Retreat(this.unit, destination)
  }
  disband () {
    return new Order.Disband(this.unit)
  }
  build () {
    return new Order.Build(this.unit)
  }
}

const unitS = Symbol('unit')

module.exports = class StandardRuleHelper {
  constructor (board) {
    this.board = board

    this[unitS] = (militaryBranch, location) => {
      if (this.board.state.phase === Phase.Movement) {
        return [...board.units].find(unit => {
          return (unit.location === location) && (unit.militaryBranch === militaryBranch)
        })
      } else if (this.board.state.phase === Phase.Retreat) {
        return [...board.units].find(unit => {
          return (unit.location === location) && (unit.militaryBranch === militaryBranch) && this.board.unitStatuses.has(unit)
        })
      } else {
        const unit = [...board.units].find(unit => {
          return (unit.location === location) && (unit.militaryBranch === militaryBranch)
        })
        if (!unit) {
          return new Unit(militaryBranch, location, location.province.homeOf)
        } else {
          return unit
        }
      }
    }
  }
  A (location) {
    return new UnitForStandardRule(this[unitS](Army, location))
  }
  F (location) {
    return new UnitForStandardRule(this[unitS](Fleet, location))
  }
}
