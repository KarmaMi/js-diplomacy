import * as Data from "./standardRule/data"
import * as OrderModule from "./standardRule/order"
import * as ErrorModule from "./standardRule/error"
import * as Types from "./standardRule/types"
import * as StandardRuleUtilsModule from "./standardRule/standard-rule-utils"
import * as StandardRuleHelperModule from "./standardRule/standard-rule-helper"
import * as RuleModule from "./standardRule/rule"

export namespace standardRule {
  export declare type Location<Power> = Types.Location<Power>
  export const Location = Types.Location

  export declare type Unit<Power> = Types.Unit<Power>
  export const Unit = Types.Unit

  export declare type Board<Power> = Types.Board<Power>
  export const Board = Types.Board

  export declare type MilitaryBranch = Data.MilitaryBranch
  export const MilitaryBranch = Data.MilitaryBranch

  export declare type Phase = Data.Phase
  export const Phase = Data.Phase

  export declare type Turn = Data.Turn

  export declare type State = Data.State
  export const State = Data.State

  export declare type Dislodged<Power> = Data.Dislodged<Power>
  export const Dislodged = Data.Dislodged

  export declare type ProvinceStatus<Power> = Data.ProvinceStatus<Power>
  export const ProvinceStatus = Data.ProvinceStatus

  export declare type Result = Data.Result
  export const Result = Data.Result

  export namespace Order {
    export declare type Order<Power> = OrderModule.Order<Power>
    export const Order = OrderModule.Order
    export declare type Hold<Power> = OrderModule.Hold<Power>
    export const Hold = OrderModule.Hold
    export declare type Move<Power> = OrderModule.Move<Power>
    export const Move = OrderModule.Move
    export declare type Support<Power> = OrderModule.Support<Power>
    export const Support = OrderModule.Support
    export declare type Convoy<Power> = OrderModule.Convoy<Power>
    export const Convoy = OrderModule.Convoy
    export declare type Retreat<Power> = OrderModule.Retreat<Power>
    export const Retreat = OrderModule.Retreat
    export declare type Disband<Power> = OrderModule.Disband<Power>
    export const Disband = OrderModule.Disband
    export declare type Build<Power> = OrderModule.Build<Power>
    export const Build = OrderModule.Build
  }

  export namespace Error {
    export declare type Error = ErrorModule.Error
    export const Error = ErrorModule.Error
    export declare type PowerWithProblem<Power> = ErrorModule.PowerWithProblem<Power>
    export const PowerWithProblem = ErrorModule.PowerWithProblem
    export declare type UnmovableLocation<Power> = ErrorModule.UnmovableLocation<Power>
    export const UnmovableLocation = ErrorModule.UnmovableLocation
    export declare type UnsupportableLocation<Power> = ErrorModule.UnsupportableLocation<Power>
    export const UnsupportableLocation = ErrorModule.UnsupportableLocation
    export declare type UnconvoyableLocation<Power> = ErrorModule.UnconvoyableLocation<Power>
    export const UnconvoyableLocation = ErrorModule.UnconvoyableLocation
    export declare type UnbuildableLocation<Power> = ErrorModule.UnbuildableLocation<Power>
    export const UnbuildableLocation = ErrorModule.UnbuildableLocation
    export declare type UnitNotExisted<Power> = ErrorModule.UnitNotExisted<Power>
    export const UnitNotExisted = ErrorModule.UnitNotExisted
    export declare type CannotBeOrdered<Power> = ErrorModule.CannotBeOrdered<Power>
    export const CannotBeOrdered = ErrorModule.CannotBeOrdered
    export declare type InvalidPhase<Power> = ErrorModule.InvalidPhase<Power>
    export const InvalidPhase = ErrorModule.InvalidPhase
    export declare type SeveralOrders<Power, MilitaryBranch> = ErrorModule.SeveralOrders<Power, MilitaryBranch>
    export const SeveralOrders = ErrorModule.SeveralOrders
    export declare type OrderNotExisted<Power> = ErrorModule.OrderNotExisted<Power>
    export const OrderNotExisted = ErrorModule.OrderNotExisted
  }

  export declare type StandardRuleUtils = StandardRuleUtilsModule.StandardRuleUtils
  export const StandardRuleUtils = StandardRuleUtilsModule.StandardRuleUtils

  export declare type StandardRuleHelper<Power> = StandardRuleHelperModule.StandardRuleHelper<Power>
  export const StandardRuleHelper = StandardRuleHelperModule.StandardRuleHelper

  export declare type Rule<Power> = RuleModule.Rule<Power>
  export const Rule = RuleModule.Rule
}
