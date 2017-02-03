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

class StandardRuleOrderHelperSpec extends UnitSpec {
  "A StandardRuleOrderHelper" when {
    "the phase is movement" should {
      val board = {
        new Board[T, map.Power](
          map.map,
          1901.Spring - Phase.Movement,
          Set(
            DiplomacyUnit(France, Army, Spa),
            DiplomacyUnit(France, Fleet, GoL)
          ), Map(), Map()
        )
      }
      val ruleHelper = StandardRuleOrderHelper(board)
      import ruleHelper._

      "generate a DiplomacyUnit." in {
        A(Spa) should be(DiplomacyUnit(France, Army, Spa))
        intercept[NoSuchElementException] { F(Spa) }
      }

      "generate Hold order." in {
        A(Spa).hold() should be(Order.Hold(A(Spa)))
      }
      "generate Move order (1)." in {
        A(Spa).move(Mar) should be(Order.Move(A(Spa), Mar, false))
      }
      "generate Move order (2)." in {
        A(Spa).moveViaConvoy(Mar) should be(Order.Move(A(Spa), Mar, true))
      }
      "generate Support order." in {
        A(Spa).support(F(GoL).move(Mar)) should be(
          Order.Support(A(Spa), Right(Order.Move(F(GoL), Mar, false)))
        )
      }
      "generate Convoy order." in {
        F(GoL).convoy(A(Spa).move(Mar)) should be(
          Order.Convoy(F(GoL), Order.Move(A(Spa), Mar, false))
        )
      }
    }

    "the phase is retreat" should {
      val board = {
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
      }
      val ruleHelper = StandardRuleOrderHelper(board)
      import ruleHelper._

      "generate a dislodged DiplomacyUnit." in {
        A(Spa) should be(DiplomacyUnit(France, Army, Spa))
        intercept[NoSuchElementException] { F(Spa_SC) }
      }

      "generate Retreat order." in {
        A(Spa).retreat(Mar) should be(Order.Retreat(A(Spa), Mar))
      }
      "generate Disband order." in {
        A(Spa).disband() should be(Order.Disband(A(Spa)))
      }
    }

    "the phase is build" should {
      val board = {
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
      }
      val ruleHelper = StandardRuleOrderHelper(board)
      import ruleHelper._

      "generate a DiplomacyUnit." in {
        A(Ber) should be(DiplomacyUnit(Germany, Army, Ber))
        A(Spa) should be(DiplomacyUnit(France, Army, Spa))
        intercept[IllegalArgumentException] { A(Ser) }
      }

      "generate Disband order." in {
        F(Spa_SC).disband() should be(Order.Disband(F(Spa_SC)))
      }
      "generate Build order." in {
        A(Mar).build() should be(Order.Build(A(Mar)))
      }
    }
  }
}
