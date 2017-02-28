import * as chai from "chai"
import { standardRule } from "./../../src/standardRule"
import { standardMap } from "./../../src/standardMap"

const { Utils, Board, Unit, MilitaryBranch, State, Phase, ProvinceStatus } =
  standardRule
declare type Power = standardMap.Power
const { locations: $, Power, map } = standardMap

const { Army, Fleet } = MilitaryBranch
const { France, England } = Power

const should = chai.should()

const turn = {
  isBuildable: true,
  isOccupationUpdateable: true,
  nextTurn: () => this
}

const state = new State(turn, Phase.Movement)

describe("The Utils", () => {
  it("calculates the number of supply centers for each power.", () => {
    const board = new Board<Power>(
      map, state, [], [],
      [
        [$.Mar.province, new ProvinceStatus<Power>(France, false)],
        [$.Spa.province, new ProvinceStatus<Power>(France, false)]
      ]
    )
    Array.from(Utils.numberOfSupplyCenters(board))
      .should.have.deep.members([[France, 2]])
  })
  it("finds the locations that an unit can move to", () => {
    const board = new Board(
      map, state,
      [
        new Unit(Army, $.Lvp, England), new Unit(Army, $.Edi, England),
        new Unit(Fleet, $.Nrg, England), new Unit(Fleet, $.Bar, England)
      ],
      [], []
    )

    Array.from(Utils.movableLocationsOf<Power>(board, new Unit(Army, $.Lvp, England)))
      .should.have.deep.members(
        [...board.map.movableLocationsOf($.Lvp, Army)]
      )
    Array.from(Utils.movableLocationsOf(board, new Unit(Army, $.Edi, England)))
      .should.have.deep.members(
        [...board.map.movableLocationsOf($.Edi, Army)].concat([$.Nwy, $.StP])
      )
  })
  it("finds the locations that an unit can support to", () => {
    const board = new Board(
      map, state,
      [
        new Unit(Army, $.Lvp, England), new Unit(Army, $.Edi, England),
        new Unit(Fleet, $.Bul_EC, England), new Unit(Fleet, $.Bla, England)
      ],
      [], []
    )

    Array.from(Utils.supportableLocationsOf<Power>(map, new Unit(Army, $.Lvp, England)))
      .should.have.deep.members([$.Cly, $.Edi, $.Yor, $.Wal])
    Array.from(Utils.supportableLocationsOf(map, new Unit(Fleet, $.Bul_EC, England)))
      .should.have.deep.members([$.Rum, $.Bla, $.Con])
    Array.from(Utils.supportableLocationsOf(map, new Unit(Fleet, $.Bla, England)))
      .should.include($.Bul_SC)
  })
  it("calculte the number of buildable units", () => {
    const board = new Board<Power>(
      map, state,
      [new Unit(Army, $.Yor, England)],
      [],
      [
        [$.Mar.province, new ProvinceStatus<Power>(France, false)],
        [$.Spa.province, new ProvinceStatus<Power>(France, false)]
      ]
    )
    const x = Utils.numberOfBuildableUnits(board)
    should.equal(x.get(France), 2)
    should.equal(x.get(England), -1)
  })
})
