import { Board } from "./../board/module"
import { OrderResult } from "./order-result"

export class ResolvedResult<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus, Result> {
  /**
   * The set of order results
   */
  results: Set<OrderResult<Power, MilitaryBranch, Result>>
  /**
   * @param board
   * @param results The set of order results
   * @param isFinished The flag whether this game is finished or not.
   */
  constructor (
    public board: Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
    results: Set<OrderResult<Power, MilitaryBranch, Result>> | Array<OrderResult<Power, MilitaryBranch, Result>>,
    public isFinished: boolean
  ) {
    this.results = new Set([...results])
  }
}
