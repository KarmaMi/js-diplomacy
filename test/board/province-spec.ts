import * as chai from "chai"
import { Name } from "./../../src/board/name"
import { Province } from "./../../src/board/province"

const should = chai.should()

describe("Province", () => {
  describe("if the province is supply center", () => {
    it("adds *.", () => {
      const prov = new Province(new Name("Lvp"), "England", true)

      prov.toString().should.equal("Lvp*")

      should.not.equal(prov.homeOf, null)
      if (prov.homeOf) {
        prov.homeOf.should.deep.equal("England")
      }
    })
  })
})
