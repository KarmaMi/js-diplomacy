import { board } from "./../board"
import { Location, Unit, Board } from "./types"
import { MilitaryBranch, Phase } from "./data"
import * as Order from "./order"

const { Province } = board

export class UnitForStandardRule<Power> {
  constructor (public unit: Unit<Power>) {}

  hold () {
    return new Order.Hold(this.unit)
  }
  move (destination: Location<Power>) {
    return new Order.Move(this.unit, destination)
  }
  moveViaConvoy (destination: Location<Power>) {
    return new Order.Move(this.unit, destination, true)
  }
  support (target: Order.Move<Power> | Order.Hold<Power>) {
    return new Order.Support(this.unit, target)
  }
  convoy (target: Order.Move<Power>) {
    return new Order.Convoy(this.unit, target)
  }

  retreat (destination: Location<Power>) {
    return new Order.Retreat(this.unit, destination)
  }
  disband () {
    return new Order.Disband(this.unit)
  }
  build () {
    return new Order.Build(this.unit)
  }
}

/**
 * Helper for creating orders of the standard rule
 * ```
 * const $$ = new Helper(board)
 * const $ = // The dictionary of the locations
 * $$.U($.Lon).move($.Nth)
 *
 * $$.U($.Mar).support($$.A($.Par).move($.Bur))
 *
 * $$.F($.Lon).build()
 *
 * $$.U($.Nrg).disband()
 * ```
 */
export class StandardRuleHelper<Power> {
  constructor (private board: Board<Power>) {}
  private getUnit (militaryBranch: MilitaryBranch | null, location: Location<Power>): Unit<Power> {
    function checkMilitaryBranch (tgt: MilitaryBranch): boolean {
      if (militaryBranch !== null) {
        return tgt === militaryBranch
      } else {
        return true
      }
    }

    if (this.board.state.phase === Phase.Movement) {
      const u = [...this.board.units].find(unit => {
        return (unit.location === location) && checkMilitaryBranch(unit.militaryBranch)
      })
      if (u) {
        return u
      } else {
        throw `Cannot find unit: ${location}`
      }
    } else if (this.board.state.phase === Phase.Retreat) {
      const u = [...this.board.units].find(unit => {
        return (unit.location === location) && checkMilitaryBranch(unit.militaryBranch) && this.board.unitStatuses.has(unit)
      })
      if (u) {
        return u
      } else {
        throw `Cannot find unit: ${location}`
      }
    } else {
      const unit = [...this.board.units].find(unit => {
        return (unit.location === location) && checkMilitaryBranch(unit.militaryBranch)
      })
      if (!unit) {
        if ((militaryBranch !== null) && location.province.homeOf) {
          return new Unit(militaryBranch, location, location.province.homeOf)
        } else {
          throw `Cannot find unit: ${location}`
        }
      } else {
        return unit
      }
    }
  }

  A (location: Location<Power>) {
    return new UnitForStandardRule(this.getUnit(MilitaryBranch.Army, location))
  }
  F (location: Location<Power>) {
    return new UnitForStandardRule(this.getUnit(MilitaryBranch.Fleet, location))
  }
  U (location: Location<Power>) {
    return new UnitForStandardRule(this.getUnit(null, location))
  }
}
