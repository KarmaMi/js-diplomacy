import * as BoardModule from "../../../board/module"
import * as RuleModule from "./../../../rule/module"
import { MilitaryBranch } from "./military-branch"
import { State } from "./state"
import { Dislodged } from "./dislodged"
import { Result } from "./result"
import { ProvinceStatus } from "./province-status"

export class Location<Power> extends BoardModule.Location<Power, MilitaryBranch> {}
export class Unit<Power> extends BoardModule.Unit<Power, MilitaryBranch> {}
export class DiplomacyMap<Power> extends BoardModule.DiplomacyMap<Power, MilitaryBranch> {}
export class Board<Power> extends
  BoardModule.Board<Power, MilitaryBranch, State, Dislodged<Power>, ProvinceStatus<Power>> {}
export class ResolvedResult<Power> extends
  RuleModule.ResolvedResult<Power, MilitaryBranch, State, Dislodged<Power>, ProvinceStatus<Power>, Result> {}
