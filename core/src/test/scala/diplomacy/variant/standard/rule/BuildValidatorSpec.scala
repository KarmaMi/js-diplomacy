package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.InvalidOrderMessage
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._
import diplomacy.variant.standard.board.{ Turn => T }
import diplomacy.variant.standard.board._

class BuildVailidatorSpec extends UnitSpec {
  val validator = new BuildValidator[T, map.Power]
  val board = {
    Board[State[T], map.Power, MilitaryBranch.MilitaryBranch, UnitStatus.UnitStatus, ProvinceStatus.ProvinceStatus](
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
  }
  val $ = StandardRuleOrderHelper(board)
  import $._

  "A build-validator" when {
    "a valid order is received" should {
      "return null (1)." in {
        validator.errorMessageOfOrder(board)(Rom.build(Army)) should be(None)
      }
      "return null (2)." in {
        validator.errorMessageOfOrder(board)(A(Mun).disband()) should be(None)
      }
    }

    "try to build an unit to a location that has another unit" should {
      "return an error message." in {
        validator.errorMessageOfOrder(board)(Nap.build(Army)) should be(Some(
          InvalidOrderMessage("An unit is in Nap.")
        ))
      }
    }
    "try to build an unit to a province that is not home province" should {
      "return an error message." in {
        validator.errorMessageOfOrder(board)(Order.Build(DiplomacyUnit(France, Army, Spa))) should be(Some(
          InvalidOrderMessage("France cannot build an unit in Spa.")
        ))
      }
    }
    "try to build an unit to a province that is not supply center" should {
      "return an error message." in {
        validator.errorMessageOfOrder(board)(Ruh.build(Army)) should be(Some(
          InvalidOrderMessage("Ruh is not supply center.")
        ))
      }
    }
    "try to build an unit to a province that is not occupied" should {
      "return an error message." in {
        validator.errorMessageOfOrder(board)(Bre.build(Army)) should be(Some(
          InvalidOrderMessage("Bre is not occupied by France.")
        ))
      }
    }

    "try to disband an unit that does not exist" should {
      "return an error message." in {
        validator.errorMessageOfOrder(board)(DiplomacyUnit(Germany, Army, Ber).disband()) should be(Some(
          InvalidOrderMessage("A Ber does not exist.")
        ))
      }
    }
    "try an unnecessary disband order" should {
      "return an error message." in {
        validator.errorMessageOfOrder(board)(F(Nap).disband()) should be(Some(
          InvalidOrderMessage("Italy has sufficient supply centers.")
        ))
      }
    }

    "valid order set is received" should {
      "return null." in {
        validator.errorMessageOfOrders(board)(Set(A(Mun).disband())) should be(None)
      }
    }
    "try to keep units that are more than supply centers" should {
      "return an error message." in {
        validator.errorMessageOfOrders(board)(Set()) should be(Some(
          InvalidOrderMessage("Germany does not have enough supply centers.")
        ))
      }
    }
  }
}
