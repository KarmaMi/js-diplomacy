import * as chai from "chai"

import { board } from "./../../src/board"
const { Name, Province } = board

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
