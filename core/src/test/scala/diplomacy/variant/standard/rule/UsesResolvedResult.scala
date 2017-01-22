package diplomacy.variant.standard.rule

import diplomacy.rule.OrderResult
import diplomacy.variant.standard.map.Power

trait UsesResolvedResult {
  type Executed = OrderResult.Executed[Power, MilitaryBranch, Order[Power], Result]
}
