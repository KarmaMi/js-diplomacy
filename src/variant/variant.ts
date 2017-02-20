import { Rule } from "../rule/module"
import { Board } from "../board/module"

/**
 * Variant of Diplomacy
 */
export class Variant<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus, Result, Error> {
  /**
   * @param rule The rule used in this variant.
   * @param initialBoard The initial state of the board used in this variant.
   */
  constructor (
    public rule: Rule<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus, Result, Error>,
    public initialBoard: Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>
  ) {}
}
