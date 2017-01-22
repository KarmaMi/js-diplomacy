package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.OrderResult
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map.Power
import diplomacy.variant.standard.map.Keywords._
import diplomacy.variant.standard.board.{ Turn => T }
import diplomacy.variant.standard.board.Keywords._
import diplomacy.variant.standard.board.Implicits._
import diplomacy.variant.standard.rule.Keywords._
import diplomacy.variant.standard.rule.Implicits._

class MovementResolverConvoyOrderSpec extends UnitSpec {
  val resolver = new MovementResolver() {
    type Turn = T
    type Power = map.Power
  }
  type Executed =
    OrderResult.Executed[resolver.Power, resolver.MilitaryBranch, resolver.Order, resolver.Result]

  "A movement-resolver" should {
    "handle DIAGRAM 19" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(England, Army, Lon),
          DiplomacyUnit(England, Fleet, Nth)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)

      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Lon).move(Nwy),
          F(Nth).convoy(A(Lon).move(Nwy))
        )
      )

      result.result should be(Set(
        new Executed(A(Lon).move(Nwy), Result.Success),
        new Executed(F(Nth).convoy(A(Lon).move(Nwy)), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(England, Army, Nwy),
          DiplomacyUnit(England, Fleet, Nth)
        )
      ))
    }

    "handle DIAGRAM 20" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(England, Army, Lon),
          DiplomacyUnit(England, Fleet, Eng),
          DiplomacyUnit(England, Fleet, Mid),
          DiplomacyUnit(England, Fleet, Wes)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)

      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Lon).move(Tun),
          F(Eng).convoy(A(Lon).move(Tun)),
          F(Mid).convoy(A(Lon).move(Tun)),
          F(Wes).convoy(A(Lon).move(Tun))
        )
      )

      result.result should be(Set(
        new Executed(A(Lon).move(Tun), Result.Success),
        new Executed(F(Eng).convoy(A(Lon).move(Tun)), Result.Success),
        new Executed(F(Mid).convoy(A(Lon).move(Tun)), Result.Success),
        new Executed(F(Wes).convoy(A(Lon).move(Tun)), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(England, Army, Tun),
          DiplomacyUnit(England, Fleet, Eng),
          DiplomacyUnit(England, Fleet, Mid),
          DiplomacyUnit(England, Fleet, Wes)
        )
      ))
    }

    "handle DIAGRAM 21" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Army, Spa),
          DiplomacyUnit(France, Fleet, GoL),
          DiplomacyUnit(France, Fleet, Tyn),
          DiplomacyUnit(Italy, Fleet, Ion),
          DiplomacyUnit(Italy, Fleet, Tun)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)

      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Spa).move(Nap),
          F(GoL).convoy(A(Spa).move(Nap)),
          F(Tyn).convoy(A(Spa).move(Nap)),
          F(Ion).move(Tyn),
          F(Tun).support(F(Ion).move(Tyn))
        )
      )

      result.result should be(Set(
        new Executed(A(Spa).move(Nap), Result.Failed),
        new Executed(F(GoL).convoy(A(Spa).move(Nap)), Result.Failed),
        new Executed(F(Tyn).convoy(A(Spa).move(Nap)), Result.Dislodged(Ion.province)),
        new Executed(F(Ion).move(Tyn), Result.Success),
        new Executed(F(Tun).support(F(Ion).move(Tyn)), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(France, Army, Spa),
          DiplomacyUnit(France, Fleet, GoL),
          DiplomacyUnit(France, Fleet, Tyn),
          DiplomacyUnit(Italy, Fleet, Tyn),
          DiplomacyUnit(Italy, Fleet, Tun)
        ),
        unitStatuses =
          Map(F(Tyn) -> UnitStatus.Dislodged(Ion.province))
      ))
    }
  }
}
