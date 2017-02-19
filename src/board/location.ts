import { Name } from "./name"
import { Province } from "./province"

/**
 * Location in Diplomacy map. Each province is expected to have 1 location at least.
 * @prop {!board.Name} name -
 *   The name of this location. It is usually same as the name of the province
 * @prop {!board.Province} province - The province that this location is in.
 * @prop {!Array.<string|Object>} militaryBranches -
 *   The set of military branches that can enter this location.
 */
export class Location<Power, MilitaryBranch> {
  /**
   * The set of military branches that can enter this location.
   */
  militaryBranches: Set<MilitaryBranch>
  /**
   * @param name The name of this location. It is usually same as the name of the province
   * @param province The province that this location is in.
   * @param militaryBranches The set of military branches that can enter this location.
   */
  constructor (
    public name: Name, public province: Province<Power>,
    militaryBranches: Set<MilitaryBranch> | Array<MilitaryBranch>
  ) {
    this.militaryBranches = new Set([...militaryBranches])
  }
  toString () {
    return `${this.name}`
  }
}
