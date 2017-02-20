import * as chai from "chai"
import { Name, Province, Location, Unit } from "./../../src/board/module"

chai.should()

describe("Unit", () => {
  it("contains its location and military-branch.", () => {
    const fleet = new Name("Fleet", "F")
    const location =
      new Location<string, Name>(
        new Name("Sweden", "Swe"), new Province(new Name("Sweden", "Swe"), null, true), [fleet]
      )
    const unit = new Unit(fleet, location, "Russia")

    unit.toString().should.equal("F Swe")
  })
})
