package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map.Power
import diplomacy.variant.standard.map.Keywords._
import diplomacy.variant.standard.board.{ Turn => T }
import diplomacy.variant.standard.board.Keywords._
import diplomacy.variant.standard.board.Implicits._

class BuildOrderGeneratorSpec extends UnitSpec {
  val generator = new BuildOrderGenerator[T, map.Power]

  "A movement-order-generator" when {
    "there are no powers that can build or disband units" should {
      "use an empty set to skip the build phase." in {
        val board =
          new Board[T, map.Power](
            map.map, 1901.Spring - Build,
            Set(), Map(), Map(), Map()
          )
        val $ = StandardRuleOrderHelper(board)
        import $._

        generator.ordersToSkipPhase(board) should be(Some(Set()))
      }
    }

    "all disband orders are automatically decidable" should {
      "use disband orders to skip the build phase." in {
        val board = {
          new Board[T, map.Power](
            map.map, 1901.Spring - Build,
            Set(
              DiplomacyUnit(Germany, Army, Ruh)
            ), Map(), Map(), Map()
          )
        }
        val $ = StandardRuleOrderHelper(board)
        import $._

        generator.ordersToSkipPhase(board) should be(Some(Set(A(Ruh).disband())))
      }
    }


    "otherwise" can {
      "not skip the build phase." in {
        val board =
          new Board[T, map.Power](
            map.map,
            1901.Autumn - Build,
            Set(
              DiplomacyUnit(Germany, Army, Mun),
              DiplomacyUnit(Italy, Fleet, Nap)
            ),
            Map(
              Rom.province -> Italy, Nap.province -> Italy,
              Mar.province -> France
            ),
            Map(), Map()
          )
        generator.ordersToSkipPhase(board) should be(None)
      }
    }
  }
}
