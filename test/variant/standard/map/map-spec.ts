import * as chai from "chai"
import { MilitaryBranch } from "./../../../../src/variant/standard/rule/module"
import { locations as $ } from "./../../../../src/variant/standard/map/location"
import { Power } from "./../../../../src/variant/standard/map/power"
import { map } from "./../../../../src/variant/standard/map/map"

const { Army, Fleet } = MilitaryBranch
const should = chai.should()

describe("Map", () => {
  it("defines a map (1).", () => {
    $.Pic.province.isSupplyCenter.should.equal(false)
    should.equal($.Pic.province.homeOf, Power.France)
    $.Bre.province.isSupplyCenter.should.equal(true)
    should.equal($.Bre.province.homeOf, Power.France)
    $.Bur.province.isSupplyCenter.should.equal(false)
    should.equal($.Bur.province.homeOf, Power.France)
    $.Gas.province.isSupplyCenter.should.equal(false)
    should.equal($.Gas.province.homeOf, Power.France)

    const provinces = map.movableProvincesOf($.Par.province, Army)

    provinces.size.should.equal(4)
    provinces.should.deep.equal(
      new Set([$.Pic.province, $.Bre.province, $.Bur.province, $.Gas.province])
    )
  })
  it("defines a map (2).", () => {
    ($.Iri.province.homeOf == null).should.equal(true)
    $.Iri.province.isSupplyCenter.should.equal(false)
    should.equal($.Wal.province.homeOf, Power.England)

    const provinces = map.movableProvincesOf($.Eng.province, Fleet)

    provinces.should.deep.equal(
      new Set([
        $.Iri.province, $.Wal.province, $.Lon.province, $.Nth.province, $.Bel.province,
        $.Pic.province, $.Bre.province, $.Mid.province
      ])
    )
  })
  it("defines a map (3).", () => {
    const provinces = map.movableProvincesOf($.Rom.province, Fleet)

    provinces.size.should.equal(3)
    provinces.should.deep.equal(new Set([
      $.Tus.province, $.Nap.province, $.Tyn.province
    ]))
  })
})
