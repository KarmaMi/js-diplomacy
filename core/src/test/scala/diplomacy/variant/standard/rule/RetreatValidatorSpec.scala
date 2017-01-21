package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.InvalidOrderMessage
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._
import diplomacy.variant.standard.board.{ Turn => T }
import diplomacy.variant.standard.board._

class RetreatVailidatorSpec extends UnitSpec {
  val validator = new RetreatValidator[T, map.Power]
  val board =
    Board[State[T], map.Power, MilitaryBranch, UnitStatus, ProvinceStatus](
      map.map,
      1901.Spring - Retreat,
      Set(
        DiplomacyUnit(France, Army, Bur),
        DiplomacyUnit(France, Army, Mar),
        DiplomacyUnit(Italy, Fleet, Wes)
      ), Map(),
      Map(
        DiplomacyUnit(France, Army, Mar) -> UnitStatus.Dislodged(Gas.province),
        DiplomacyUnit(Italy, Fleet, Wes) -> UnitStatus.Dislodged(Tyn.province)
      ),
      Map(Pie.province -> ProvinceStatus.Standoff)
    )
  val $ = StandardRuleOrderHelper(board)
  import $._

  "A retreat-validator" when {
    "a valid order is received" should {
      "return null (1)." in {
        validator.errorMessageOfOrder(board)(A(Mar).retreat(Spa)) should be(None)
      }
      "return null (2)." in {
        validator.errorMessageOfOrder(board)(A(Mar).disband()) should be(None)
      }
    }
    "an order that its target unit is not dislodged is received" should {
      "return an error message." in {
        validator.errorMessageOfOrder(board)(Order.Disband(DiplomacyUnit(France, Army, Bur))) should be(
          Option(InvalidOrderMessage("A Bur is not dislodged."))
        )
      }
    }
    "an order that its target unit retreat to an invalid location" should {
      "return an error message." in {
        validator.errorMessageOfOrder(board)(A(Mar).retreat(Gas)) should be(
          Option(InvalidOrderMessage("A Mar cannot retreat to Gas."))
        )
      }
    }

    "a set or orders that some dislodged unit have no order" should {
      "return an error message." in {
        validator.errorMessageOfOrders(board)(Set(A(Mar).retreat(Gas))) should be(
          Option(InvalidOrderMessage("F Wes has no order."))
        )
      }
    }
  }
}
