package diplomacy.variant.standard.rule

import diplomacy.rule.{ Rule => BaseRule }

object Rule {
  trait TypeHelper extends BaseRule.TypeHelper {
    type Turn <: diplomacy.variant.standard.rule.Turn

    type State = diplomacy.variant.standard.rule.State[Turn]
    type MilitaryBranch = MilitaryBranch.MilitaryBranch
    type UnitStatus = UnitStatus.UnitStatus
    type ProvinceStatus = ProvinceStatus.ProvinceStatus
    type Order = Order.Order[Power]
    type Result = diplomacy.variant.standard.rule.Result.Result
  }
}
