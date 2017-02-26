import * as chai from "chai"
import { standard } from "./../../src/standard"
import { standardRule } from "./../../src/standardRule"
import { standardMap } from "./../../src/standardMap"

const variant = standard.variant
const StandardRuleUtils = standardRule.StandardRuleUtils
const Power = standardMap.Power

const should = chai.should()

describe("Variant", () => {
  it("defines an initial board.", () => {
    const numberOfSupplyCenters = StandardRuleUtils.numberOfSupplyCenters(variant.initialBoard)
    variant.initialBoard.map.powers.forEach(power => {
      const numOfUnits = ([...variant.initialBoard.units].filter(u => u.power === power)).length
      if (power === Power.Russia) {
        should.equal(numberOfSupplyCenters.get(power), 4)
        numOfUnits.should.equal(4)
      } else {
        should.equal(numberOfSupplyCenters.get(power), 3)
        numOfUnits.should.equal(3)
      }
    })
  })
})
