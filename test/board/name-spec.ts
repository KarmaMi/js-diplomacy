import * as chai from "chai"
import { Name } from "./../../src/board/name"

chai.should()

describe("Name", () => {
  it("receives a name and an abbreviated name.", () => {
    const name = new Name("English Channel", "Eng")

    name.name.should.equal("English Channel")
    name.abbreviatedName.should.equal("Eng")
  })
  it("omit an abbreviated name", () => {
    const name = new Name("Sweden")

    name.abbreviatedName.should.equal("Sweden")
  })
  it("implements a custom toString.", () => {
    const name = new Name("English Channel", "Eng")

    name.toString().should.equal("Eng")
  })
})
