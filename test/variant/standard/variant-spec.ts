import * as chai from "chai"
import { variant } from "../../../src/variant/standard/module"
import { StandardRuleUtils } from "./../../../src/variant/standard/rule/module"
import { Power } from "./../../../src/variant/standard/map/module"

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
