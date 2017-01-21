package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.OrderResult
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._
import diplomacy.variant.standard.board.{ Turn => T }
import diplomacy.variant.standard.board._

class MovementResolverStandoffSpec extends UnitSpec {
  val resolver = new MovementResolver() {
    type Turn = T
    type Power = map.Power
  }

  type Executed =
    OrderResult.Executed[resolver.Power, resolver.MilitaryBranch, resolver.Order, resolver.Result]

  "A movement-resolver" should {
    "handle DIAGRAM 4" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Germany, Army, Ber),
          DiplomacyUnit(Russia, Army, War)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Ber).move(Sil),
          A(War).move(Sil)
        )
      )

      result.result should be(Set(
        new Executed(A(Ber).move(Sil), Result.Bounced),
        new Executed(A(War).move(Sil), Result.Bounced)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        provinceStatuses = Map(Sil.province -> ProvinceStatus.Standoff)
      ))
    }

    "handle DIAGRAM 5" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Germany, Army, Kie),
          DiplomacyUnit(Germany, Army, Ber),
          DiplomacyUnit(Russia, Army, Pru)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Kie).move(Ber),
          A(Ber).move(Pru),
          A(Pru).hold()
        )
      )

      result.result should be(Set(
        new Executed(A(Ber).move(Pru), Result.Bounced),
        new Executed(A(Kie).move(Ber), Result.Bounced),
        new Executed(A(Pru).hold(), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat
      ))
    }

    "handle DIAGRAM 6" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Germany, Army, Ber),
          DiplomacyUnit(Russia, Army, Pru)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Ber).move(Pru),
          A(Pru).move(Ber))
        )

      result.result should be(Set(
        new Executed(A(Ber).move(Pru), Result.Bounced),
        new Executed(A(Pru).move(Ber), Result.Bounced)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat
      ))
    }

    "handle DIAGRAM 7" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(England, Fleet, Bel),
          DiplomacyUnit(England, Fleet, Nth),
          DiplomacyUnit(Germany, Army, Hol)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          F(Bel).move(Nth),
          F(Nth).move(Hol),
          A(Hol).move(Bel)
        )
      )

      result.result should be(Set(
        new Executed(F(Bel).move(Nth), Result.Success),
        new Executed(F(Nth).move(Hol), Result.Success),
        new Executed(A(Hol).move(Bel), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(England, Fleet, Hol),
          DiplomacyUnit(England, Fleet, Nth),
          DiplomacyUnit(Germany, Army, Bel)
        )
      ))
    }
  }
}
