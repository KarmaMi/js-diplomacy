import { LabeledEdge } from "../util/labeled-edge"
import { Location } from "./location"

/**
 * Relation between board.Location
 */
export class MapEdge<Power, MilitaryBranch>
  extends LabeledEdge<Location<Power, MilitaryBranch>, Set<MilitaryBranch>> {
  /**
   * @param n1 The end point 1.
   * @param n2 The end point 2.
   * @param label The set of military branches.
   */
  constructor (
    n1: Location<Power, MilitaryBranch>, n2: Location<Power, MilitaryBranch>,
    militaryBranches: Set<MilitaryBranch> | Array<MilitaryBranch>
  ) {
    super(n1, n2, new Set([...militaryBranches]))
  }
}
