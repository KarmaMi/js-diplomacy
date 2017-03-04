import * as chai from "chai"
import { standardRule } from "./../../src/standardRule"
import { standardMap } from "./../../src/standardMap"

const { Unit, MilitaryBranch } = standardRule
const { locations: $, Power } = standardMap

const should = chai.should()

describe("An unit", () => {
  it("stringify its military branch", () => {
    const u = new Unit(MilitaryBranch.Army, $.Boh, Power.Austria)
    u.toString().should.equal("A Boh")
  })
})
