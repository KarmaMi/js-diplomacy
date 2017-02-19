import { Unit } from "./../board/module"

export interface Order<Power, MilitaryBranch> {
  /**
   * The unit of Diplomacy that corresponds to this order.
   */
  unit: Unit<Power, MilitaryBranch>
}
