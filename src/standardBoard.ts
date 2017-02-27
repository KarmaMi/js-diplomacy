import { standardRule } from "./standardRule"

export namespace standardBoard {
  export enum Season {
    Spring = 1,
    Autumn
  }

  /**
   * The turn of standard Diplomacy rule
   */
  export class Turn implements standardRule.Turn {
    isBuildable: boolean
    isOccupationUpdateable: boolean
    constructor (public year: number, public season: Season) {
      this.isBuildable = season === Season.Autumn
      this.isOccupationUpdateable = season === Season.Autumn
    }
    nextTurn () {
      if (this.season === Season.Autumn) {
        return new Turn(this.year + 1, Season.Spring)
      } else {
        return new Turn(this.year, Season.Autumn)
      }
    }
  }
}
