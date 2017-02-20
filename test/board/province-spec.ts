import * as chai from "chai"
import { Name, Province } from "./../../src/board/module"

const should = chai.should()

describe("Province", () => {
  describe("if the province is supply center", () => {
    it("adds *.", () => {
      const prov = new Province(new Name("Lvp"), "England", true)

      prov.toString().should.equal("Lvp*")

      should.equal(prov.homeOf, "England")
    })
  })
})
