import { board } from "./../board"
import { rule } from "./../rule"
import { MilitaryBranch, Result, State, Dislodged, ProvinceStatus } from "./data"

export class Location<Power> extends board.Location<Power, MilitaryBranch> {}
export class Unit<Power> extends board.Unit<Power, MilitaryBranch> {}
export class DiplomacyMap<Power> extends board.DiplomacyMap<Power, MilitaryBranch> {}
export class Board<Power> extends
  board.Board<Power, MilitaryBranch, State, Dislodged<Power>, ProvinceStatus<Power>> {}
export class ResolvedResult<Power> extends
  rule.ResolvedResult<Power, MilitaryBranch, State, Dislodged<Power>, ProvinceStatus<Power>, Result> {}
