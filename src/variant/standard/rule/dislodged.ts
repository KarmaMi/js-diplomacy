import { Province } from "../../../board/module"

/**
 * Status that an unit is dislodged
 */
export class Dislodged<Power> {
  /**
   * @param attackedFrom - The province that the unit is attacked from
   */
  constructor (public attackedFrom: Province<Power>) {}
}
