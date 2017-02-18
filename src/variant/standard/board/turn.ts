'use strict'

import { Turn as BaseTurn } from "./../rule/module"
import { Season } from "./season"

/**
 * The turn of standard Diplomacy rule
 */
export class Turn implements BaseTurn {
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
