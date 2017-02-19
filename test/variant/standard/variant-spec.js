"use strict"

const chai = require("chai")

const standard = require("./../../../lib/variant/standard/variant")
const { StandardRuleUtils } = require("./../../../lib/variant/standard/rule/package")
const { Power: { Russia } } = require("./../../../lib/variant/standard/map/package")

chai.should()

describe("Variant", () => {
  it("defines an initial board.", () => {
    const numberOfSupplyCenters = StandardRuleUtils.numberOfSupplyCenters(standard.initialBoard)
    standard.initialBoard.map.powers.forEach(power => {
      const numOfUnits = ([...standard.initialBoard.units].filter(u => u.power === power)).length
      if (power === Russia) {
        numberOfSupplyCenters.get(power).should.equal(4)
        numOfUnits.should.equal(4)
      } else {
        numberOfSupplyCenters.get(power).should.equal(3)
        numOfUnits.should.equal(3)
      }
    })
  })
})
