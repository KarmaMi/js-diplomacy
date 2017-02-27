import { rule } from "./rule"
import { board } from "./board"

export namespace variant {
  /**
   * Variant of Diplomacy
   */
  export class Variant<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus, Result, Error> {
    /**
     * @param rule The rule used in this variant.
     * @param initialBoard The initial state of the board used in this variant.
     */
    constructor (
      public rule: rule.Rule<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus, Result, Error>,
      public initialBoard: board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>
    ) {}
  }
}
