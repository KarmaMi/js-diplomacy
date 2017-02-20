import * as chai from "chai"
import { Name, Province, Location } from "./../../src/board/module"

chai.should()

describe("Location", () => {
  it("has a province.", () => {
    const Fleet = new Name("Fleet", "F")
    const Army = new Name("Army", "A")
    const location =
      new Location<string, Name>(
        new Name("Sweden", "Swe"), new Province(new Name("Sweden", "Swe"), null, true),
        [Fleet, Army]
      )

    location.province.should.deep.equal(new Province(new Name("Sweden", "Swe"), null, true))
  })
  it("has the set of the military branches that can enter this location.", () => {
    const Fleet = new Name("Fleet", "F")
    const location =
      new Location<string, Name>(
        new Name("Spain", "Spa"), new Province(new Name("Spain", "Spa"), null, true),
        [Fleet]
      )

    Array.from(location.militaryBranches).should.have.deep.members([Fleet])
  })
})
