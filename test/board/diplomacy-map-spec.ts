import * as chai from "chai"

import { board } from "./../../src/board"
const { Name, Province, Location } = board

import * as mockMap from "./../mock/map"
const [Army, Fleet] = mockMap.militaryBranches
const [spain, naples, apulia, western] = mockMap.provinces
const [spa, spaSc, nap, apu, wes] = mockMap.locations
const map = mockMap.map

chai.should()

describe("DiplomacyMap", () => {
  it("returns locations that belong to an province", () => {
    Array.from(map.locationsOf(spain)).should.have.deep.members([spaSc])
  })
  it("returns provinces that an unit in the province can move to.", () => {
    Array.from(map.movableProvincesOf(spain, Fleet)).should.have.deep.members([western])
  })
  it("returns locations that an unit can move to.", () => {
    Array.from(map.movableLocationsOf(spa, Army)).should.have.deep.members([])
    Array.from(map.movableLocationsOf(spaSc, Fleet)).should.have.deep.members([wes])
    Array.from(map.movableLocationsOf(apu, Fleet)).should.have.deep.members([])
  })
})
