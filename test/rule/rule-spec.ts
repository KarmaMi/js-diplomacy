import * as chai from "chai"
import { board } from "./../../src/board"
import { rule } from "./../../src/rule"
const { Name, Unit, Board } = board
const { ResolvedResult, Executed, Replaced } = rule

const should = chai.should()

import * as mockMap from "../mock/map"
import { MockOrder } from "../mock/mock-order"
import { MockRule } from "./../mock/mock-rule"

const [Army, Fleet] = mockMap.militaryBranches
const [spain, naples, apulia, western] = mockMap.provinces
const [spa, spaSc, nap, apu, wes] = mockMap.locations
const map = mockMap.map

class MockOrder2 extends MockOrder {
  replaced: boolean
  constructor (unit: board.Unit<string, board.Name>, replaced?: boolean) {
    super(unit)
    this.replaced = replaced || false
  }
}

describe("A rule", () => {
  const unit = new Unit(Fleet, nap, "France")
  const board = new Board(map, "State", [unit], [], [])

  describe("when resolving an invalid order", () => {
    it("uses a default order", () => {
      const unit1 = new Unit(Fleet, nap, "France")
      const unit2 = new Unit(Army, spa, "France")
      const board = new Board(map, "State", [unit1, unit2], [], [])

      const rule: any = new MockRule()
      rule.errorOfOrder = (b: typeof board, order: MockOrder2) => {
        return (order.unit === unit1 || order.replaced) ? null : "Invalid"
      }
      rule.defaultOrderOf = (b: typeof board, unit: board.Unit<string, board.Name>) => {
        return new MockOrder2(unit, true)
      }
      rule.resolveProcedure = (b: typeof board, orders: Set<MockOrder2>) => {
        return {
          result: new ResolvedResult(
            board,
            [...orders].map(order => new Executed(order, "Resolved")),
            true
          )
        }
      }

      const result = (<MockRule>rule).resolve(
        board, new Set([new MockOrder2(unit1), new MockOrder2(unit2)])
      ).result

      should.not.equal(result, null)
      if (result) {
        result.results.should.deep.equal(new Set([
          new Executed(new MockOrder2(unit1), "Resolved"),
          new Replaced(new MockOrder2(unit2), "Invalid", new MockOrder2(unit2, true), "Resolved")
        ]))
      }
    })
  })
  describe("when the set of orders are invalid", () => {
    it("does not resolve the orders", () => {
      const rule: any = new MockRule()
      rule.errorOfOrders = (b: typeof board, orders: Set<MockOrder>) => "Invalid";
      (<MockRule>rule).resolve(board, new Set([new MockOrder(unit)])).should.deep.equal({
        err: "Invalid"
      })
    })
  })
  describe("when several unit that require an order do not have orders", () => {
    it("uses a default order.", () => {
      const unit1 = new Unit(Fleet, nap, "France")
      const unit2 = new Unit(Army, spa, "France")
      const board = new Board(map, "State", [unit1, unit2], [], [])

      const rule: any = new MockRule()
      rule.unitsRequiringOrder = (b: typeof board) => board.units
      rule.defaultOrderOf = (b: typeof board, unit: board.Unit<string, board.Name>) => {
        const o = new MockOrder(unit)
        return o
      }
      rule.resolveProcedure = (b: typeof board, orders: Set<MockOrder>) => {
        return {
          result: new ResolvedResult(
            board,
            [...orders].map(order => new Executed(order, "Resolved")),
            true
          )
        }
      }
      const result = rule.resolve(board, new Set()).result

      should.not.equal(null, result)
      if (result) {
        result.results.should.deep.equal(new Set([
          new Executed(new MockOrder(unit1), "Resolved"),
          new Executed(new MockOrder(unit2), "Resolved")
        ]))
      }
    })
    it("retuns an error if there are no default order.", () => {
      const rule: any = new MockRule()
      rule.unitsRequiringOrder = (b: typeof board) => board.units
      try {
        rule.resolve(board, new Set())
      } catch (e) {
        e.should.deep.equal("F Nap: no order")
      }
    })
  })
})
