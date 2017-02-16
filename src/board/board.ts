import { DiplomacyMap } from "./diplomacy-map"
import { Unit } from "./unit"
import { Province } from "./province"

export class Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus> {
  /**
   * The units that are in this board
   */
  units: Set<Unit<Power, MilitaryBranch>>
  /**
   * The state of each unit (e.g., the unit was dislodged)
   */
  unitStatuses: Map<Unit<Power, MilitaryBranch>, UnitStatus>
  /**
   * The state of each province (e.g., standoff was occurred, this province is occupied by X)
   */
  provinceStatuses: Map<Province<Power>, ProvinceStatus>
  /**
   * @param map
   * @param state
   * @param units The units that are in this board
   * @param unitStatuses The state of each unit (e.g., the unit was dislodged)
   * @param provinceStatuses
   *   The state of each province (e.g., standoff was occurred, this province is occupied by X)
   */
  constructor (
    public map: DiplomacyMap<Power, MilitaryBranch>, public state: State,
    units: Set<Unit<Power, MilitaryBranch>> | Array<Unit<Power, MilitaryBranch>>,
    unitStatuses: Map<Unit<Power, MilitaryBranch>, UnitStatus> | Array<[Unit<Power, MilitaryBranch>, UnitStatus]>,
    provinceStatuses: Map<Province<Power>, ProvinceStatus> | Array<[Province<Power>, ProvinceStatus]>
  ) {
    this.units = new Set([...units])
    this.unitStatuses = new Map([...unitStatuses])
    this.provinceStatuses = new Map([...provinceStatuses])
  }
}
