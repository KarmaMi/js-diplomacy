package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.InvalidOrderMessage
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map.Power
import diplomacy.variant.standard.map.Keywords._
import diplomacy.variant.standard.board.{ Turn => T }
import diplomacy.variant.standard.board.Keywords._
import diplomacy.variant.standard.board.Implicits._
import diplomacy.variant.standard.rule.Keywords._
import diplomacy.variant.standard.rule.Implicits._

class RetreatVailidatorSpec extends UnitSpec {
  val validator = new RetreatValidator[T, map.Power]
  val board =
    new Board[T, map.Power](
      map.map,
      1901.Spring - Retreat,
      Set(
        DiplomacyUnit(France, Army, Bur),
        DiplomacyUnit(France, Army, Mar),
        DiplomacyUnit(Italy, Fleet, Wes)
      ),
      Map(
        DiplomacyUnit(France, Army, Mar) -> UnitStatus.Dislodged(Gas.province),
        DiplomacyUnit(Italy, Fleet, Wes) -> UnitStatus.Dislodged(Tyn.province)
      ),
      Map(Pie.province -> ProvinceStatus(None, true))
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
