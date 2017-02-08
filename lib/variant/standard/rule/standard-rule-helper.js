'use strict'

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

/**
 * @classdesc Helper for creating orders of the standard rule
 * @memberof variant.standard.rule
 * @example
 * const $$ = new Helper(board)
 * const $ = // The dictionary of the locations
 * $$.U($.Lon).move($.Nth)
 * @example
 * const $$ = new Helper(board)
 * const $ = // The dictionary of the locations
 * $$.U($.Mar).support($$.A($.Par).move($.Bur))
 * @example
 * const $$ = new Helper(board)
 * const $ = // The dictionary of the locations
 * $$.F($.Lon).build()
 * @example
 * const $$ = new Helper(board)
 * const $ = // The dictionary of the locations
 * $$.U($.Nrg).disband()
 */
class StandardRuleHelper {
  constructor (board) {
    this.board = board

    this[unitS] = (militaryBranch, location) => {
      function checkMilitaryBranch (tgt) {
        if (militaryBranch !== null) {
          return tgt === militaryBranch
        } else {
          return true
        }
      }

      if (this.board.state.phase === Phase.Movement) {
        return [...board.units].find(unit => {
          return (unit.location === location) && checkMilitaryBranch(unit.militaryBranch)
        })
      } else if (this.board.state.phase === Phase.Retreat) {
        return [...board.units].find(unit => {
          return (unit.location === location) && checkMilitaryBranch(unit.militaryBranch) && this.board.unitStatuses.has(unit)
        })
      } else {
        const unit = [...board.units].find(unit => {
          return (unit.location === location) && checkMilitaryBranch(unit.militaryBranch)
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
  U (location) {
    return new UnitForStandardRule(this[unitS](null, location))
  }
}

module.exports = StandardRuleHelper
