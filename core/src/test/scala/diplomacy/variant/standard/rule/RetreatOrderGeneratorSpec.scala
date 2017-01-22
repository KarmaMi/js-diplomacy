package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map.Power
import diplomacy.variant.standard.map.Keywords._
import diplomacy.variant.standard.board.{ Turn => T }
import diplomacy.variant.standard.board.Keywords._
import diplomacy.variant.standard.board.Implicits._

class RetreatOrderGeneratorSpec extends UnitSpec {
  val generator = new RetreatOrderGenerator[T, map.Power]
  val board = {
    new Board[T, map.Power](
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
  }

  "A movement-order-generator" should {
    "use Disband as a default order." in {
      val $ = StandardRuleOrderHelper(board)
      import $._
      generator.defaultOrder(board)(A(Mar)) should be(A(Mar).disband())
      generator.defaultOrder(board)(F(Wes)) should be(F(Wes).disband())
    }
  }
  it when {
    "all dislodged units cannot retreat" should {
      "use disband orders to skip the retreat phase." in {
        val board = {
          new Board[T, map.Power](
            map.map, 1901.Spring - Retreat,
            Set(
              DiplomacyUnit(Germany, Army, Par),
              DiplomacyUnit(Germany, Army, Gas),
              DiplomacyUnit(Germany, Army, Bre),
              DiplomacyUnit(France, Army, Bre)
            ),
            Map(), Map(DiplomacyUnit(France, Army, Bre) -> UnitStatus.Dislodged(Pic.province)),
            Map()
          )
        }
        val $ = StandardRuleOrderHelper(board)
        import $._

        generator.ordersToSkipPhase(board) should be(Some(Set(A(Bre).disband())))
      }
    }

    "there are some units that can retreat" can {
      "not skip the retreat phase." in {
        generator.ordersToSkipPhase(board) should be(None)
      }
    }
  }
}
