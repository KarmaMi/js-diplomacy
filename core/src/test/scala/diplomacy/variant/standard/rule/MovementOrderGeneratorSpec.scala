package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._

class MovementOrderGeneratorSpec extends UnitSpec {
  val generator = new MovementOrderGenerator {
    type Turn = map.Turn
    type Power = map.Power
  }
  val board = {
    Board[State[map.Turn], Power.Power, MilitaryBranch.MilitaryBranch, UnitStatus.UnitStatus, ProvinceStatus.ProvinceStatus](
      map.map,
      1901.Spring - Movement,
      Set(
        DiplomacyUnit(France, Army, Spa),
        DiplomacyUnit(France, Fleet, GoL)
      ), Map(), Map(), Map()
    )
  }

  "A movement-order-generator" should {
    "use Hold as a default order." in {
      val $ = StandardRuleOrderHelper(board)
      import $._
      generator.defaultOrder(board)(A(Spa)) should be(A(Spa).hold())
      generator.defaultOrder(board)(F(GoL)) should be(F(GoL).hold())
    }
  }
  it when {
    "there are no units" should {
      "use an empty to skip the movement phase." in {
        val emptyBoard = {
          Board[State[map.Turn], Power.Power, MilitaryBranch.MilitaryBranch, UnitStatus.UnitStatus, ProvinceStatus.ProvinceStatus](
            map.map, 1901.Spring - Movement, Set(), Map(), Map(), Map()
          )
        }
        generator.ordersToSkipPhase(emptyBoard) should be(Some(Set()))
      }
    }

    "there are some units" can {
      "not skip the movement phase." in {
        generator.ordersToSkipPhase(board) should be(None)
      }
    }
  }
}
