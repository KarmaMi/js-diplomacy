package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map.Power
import diplomacy.variant.standard.map.Keywords._
import diplomacy.variant.standard.board.{ Turn => T }
import diplomacy.variant.standard.board.Keywords._
import diplomacy.variant.standard.board.Implicits._
import diplomacy.variant.standard.rule.Keywords._
import diplomacy.variant.standard.rule.Implicits._

class JsStandardRuleHelperSpec extends UnitSpec {
  "A JsStandardRuleHelper" when {
    "the phase is movement" should {
      val board =
        new Board[T, map.Power](
          map.map,
          1901.Spring - Phase.Movement,
          Set(
            DiplomacyUnit(France, Army, Spa),
            DiplomacyUnit(France, Fleet, GoL)
          ), Map(), Map()
        )
      val ruleHelper = new JsStandardRuleHelper(JsBoard(board))
      import ruleHelper._

      "generate a DiplomacyUnit." in {
        A(Spa).unit should be(DiplomacyUnit(France, Army, Spa))
        intercept[NoSuchElementException] { F(Spa) }
      }

      "generate Hold order." in {
        A(Spa).hold().order should be(Order.Hold(A(Spa).unit))
      }
      "generate Move order (1)." in {
        A(Spa).move(Mar).order should be(Order.Move(A(Spa).unit, Mar, false))
      }
      "generate Move order (2)." in {
        A(Spa).moveViaConvoy(Mar).order should be(Order.Move(A(Spa).unit, Mar, true))
      }
      "generate Support order." in {
        A(Spa).support(F(GoL).move(Mar)).order should be(
          Order.Support(A(Spa).unit, Right(Order.Move(F(GoL).unit, Mar, false)))
        )
      }
      "generate Convoy order." in {
        F(GoL).convoy(A(Spa).move(Mar)).order should be(
          Order.Convoy(F(GoL).unit, Order.Move(A(Spa).unit, Mar, false))
        )
      }
    }

    "the phase is retreat" should {
      val board =
        new Board[T, map.Power](
          map.map,
          1901.Spring - Phase.Retreat,
          Set(
            DiplomacyUnit(France, Army, Spa),
            DiplomacyUnit(France, Fleet, Spa_SC)
          ),
          Map(DiplomacyUnit(France, Army, Spa) -> UnitStatus.Dislodged(Mar.province)),
          Map()
        )
      val ruleHelper = new JsStandardRuleHelper(JsBoard(board))
      import ruleHelper._

      "generate a dislodged DiplomacyUnit." in {
        A(Spa).unit should be(DiplomacyUnit(France, Army, Spa))
        intercept[NoSuchElementException] { F(Spa_SC) }
      }

      "generate Retreat order." in {
        A(Spa).retreat(Mar).order should be(Order.Retreat(A(Spa).unit, Mar))
      }
      "generate Disband order." in {
        A(Spa).disband().order should be(Order.Disband(A(Spa).unit))
      }
    }

    "the phase is build" should {
      val board =
        new Board[T, map.Power](
          map.map,
          1901.Spring - Phase.Build,
          Set(
            DiplomacyUnit(France, Army, Spa),
            DiplomacyUnit(France, Fleet, Spa_SC)
          ),
          Map(DiplomacyUnit(France, Army, Spa) -> UnitStatus.Dislodged(Mar.province)),
          Map()
        )
      val ruleHelper = new JsStandardRuleHelper(JsBoard(board))
      import ruleHelper._

      "generate a DiplomacyUnit." in {
        A(Ber).unit should be(DiplomacyUnit(Germany, Army, Ber))
        A(Spa).unit should be(DiplomacyUnit(France, Army, Spa))
        intercept[IllegalArgumentException] { A(Ser) }
      }

      "generate Disband order." in {
        F(Spa_SC).disband().order should be(Order.Disband(F(Spa_SC).unit))
      }
      "generate Build order." in {
        A(Mar).build().order should be(Order.Build(A(Mar).unit))
      }
    }
  }
}
