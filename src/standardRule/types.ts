import { board } from "./../board"
import { rule } from "./../rule"
import { MilitaryBranch, Result, State, Dislodged, ProvinceStatus } from "./data"

export class Location<Power> extends board.Location<Power, MilitaryBranch> {}
export class Unit<Power> extends board.Unit<Power, MilitaryBranch> {
  toString (): string {
    switch (this.militaryBranch) {
      case MilitaryBranch.Army:
        return `A ${this.location}`
      case MilitaryBranch.Fleet:
        return `F ${this.location}`
    }
  }
}
export class DiplomacyMap<Power> extends board.DiplomacyMap<Power, MilitaryBranch> {}
export class Board<Power> extends
  board.Board<Power, MilitaryBranch, State, Dislodged<Power>, ProvinceStatus<Power>> {}
export class ResolvedResult<Power> extends
  rule.ResolvedResult<Power, MilitaryBranch, State, Dislodged<Power>, ProvinceStatus<Power>, Result> {}
