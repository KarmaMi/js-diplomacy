import { board } from "./../board"
import * as OrderModule from "./order"
import * as ErrorModule from "./error"

export enum MilitaryBranch {
  Army,
  Fleet
}

export enum Phase {
  Movement,
  Retreat,
  Build
}

export interface Turn {
  /**
   * The flag whether there is a build phase in this turn.
   */
  isBuildable: boolean
  /*
   * The flag whether the occupation status is updated in this turn or not.
   */
  isOccupationUpdateable: boolean
  /**
   * @return The next turn (For example, 1901 Autumn if this instance represents 1901 Spring)
   */
  nextTurn(): Turn
}

export class State {
  constructor (public turn: Turn, public phase: Phase) {}
}

/**
 * Status that an unit is dislodged
 */
export class Dislodged<Power> {
  /**
   * @param attackedFrom - The province that the unit is attacked from
   */
  constructor (public attackedFrom: board.Province<Power>) {}
}

/**
 * Status of the province
 */
export class ProvinceStatus<Power> {
  /**
   * @param occupied
   *    The power that occupies the province. The province is neutral if this property is null
   * @param standoff The flag whether standoff is occurred or not
   */
  constructor (public occupied: Power | null, public standoff: boolean) {}
}

export enum Result {
  Success,
  Failed,
  Dislodged,
  Bounced,
  Cut,
  Standoff,
  NoCorrespondingOrder
}
