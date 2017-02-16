import { Location } from "./location"

/**
 * Unit of Diplomacy
 */
export class Unit<Power, MilitaryBranch> {
  /**
   * @param militaryBranch The military branch of this unit.
   * @param location The location where this unit is in.
   * @param power The power that has this unit.
   */
  constructor (
    public militaryBranch: MilitaryBranch, public location: Location<Power, MilitaryBranch>,
    public power: Power
  ) {
    console.assert(this.location.militaryBranches.has(militaryBranch))
  }

  toString () {
    return `${this.militaryBranch} ${this.location}`
  }
}
