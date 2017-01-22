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

class MovementResolverOtherCasesSpec extends UnitSpec {
  val resolver = new MovementResolver() {
    type Turn = T
    type Power = map.Power
  }
  type Executed =
    OrderResult.Executed[resolver.Power, resolver.MilitaryBranch, resolver.Order, resolver.Result]

  "A movement-resolver" should {
    "handle the case when a support order has no corresponding order." in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Army, Par),
          DiplomacyUnit(France, Army, Mar)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Par).move(Bur),
          A(Mar).support(A(Par).move(Gas))
        )
      )

      result.result should be(Set(
        new Executed(A(Par).move(Bur), Result.Success),
        new Executed(A(Mar).support(A(Par).move(Gas)), Result.NoCorrespondingOrder)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(France, Army, Bur),
          DiplomacyUnit(France, Army, Mar)
        )
      ))
    }

    "handle the case when a convoy order has no corresponding order." in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Army, Bre),
          DiplomacyUnit(France, Fleet, Eng)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Bre).move(Par),
          F(Eng).convoy(A(Bre).move(Lon))
        )
      )

      result.result should be(Set(
        new Executed(A(Bre).move(Par), Result.Success),
        new Executed(F(Eng).convoy(A(Bre).move(Lon)), Result.NoCorrespondingOrder)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(France, Army, Par),
          DiplomacyUnit(France, Fleet, Eng)
        )
      ))
    }

    "swap locations using convoy (1)." in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Germany, Army, Pru),
          DiplomacyUnit(Germany, Army, Ber),
          DiplomacyUnit(Germany, Fleet, Bal)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Pru).move(Ber),
          A(Ber).move(Pru),
          F(Bal).convoy(A(Pru).move(Ber))
        )
      )

      result.result should be(Set(
        new Executed(A(Pru).move(Ber), Result.Success),
        new Executed(A(Ber).move(Pru), Result.Success),
        new Executed(F(Bal).convoy(A(Pru).move(Ber)), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat
      ))
    }

    "swap locations using convoy (2)." in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Germany, Army, Ber),
          DiplomacyUnit(Germany, Fleet, Bal),
          DiplomacyUnit(Russia, Army, Pru),
          DiplomacyUnit(Russia, Army, Sil)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Pru).move(Ber),
          A(Sil).support(A(Pru).move(Ber)),
          A(Ber).move(Pru),
          F(Bal).convoy(A(Pru).move(Ber))
        )
      )

      result.result should be(Set(
        new Executed(A(Pru).move(Ber), Result.Success),
        new Executed(A(Ber).move(Pru), Result.Success),
        new Executed(F(Bal).convoy(A(Pru).move(Ber)), Result.Success),
        new Executed(A(Sil).support(A(Pru).move(Ber)), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(Germany, Army, Pru),
          DiplomacyUnit(Germany, Fleet, Bal),
          DiplomacyUnit(Russia, Army, Ber),
          DiplomacyUnit(Russia, Army, Sil)
        )
      ))
    }

    "handle the case that two support orders supports each other." in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(England, Fleet, Nth),
          DiplomacyUnit(England, Fleet, Nwy)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          F(Nth).support(F(Nwy).hold()),
          F(Nwy).support(F(Nth).hold())
        )
      )

      result.result should be(Set(
        new Executed(F(Nth).support(F(Nwy).hold()), Result.Success),
        new Executed(F(Nwy).support(F(Nth).hold()), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat
      ))
    }

    "handle self standoffs." in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Army, Par),
          DiplomacyUnit(France, Army, Mar)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Par).move(Bur),
          A(Mar).move(Bur)
        )
      )

      result.result should be(Set(
        new Executed(A(Par).move(Bur), Result.Bounced),
        new Executed(A(Mar).move(Bur), Result.Bounced)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        provinceStatuses = Map(Bur.province -> ProvinceStatus.Standoff)
      ))
    }

    "handle self cutting support." in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Army, Par),
          DiplomacyUnit(France, Army, Bur),
          DiplomacyUnit(France, Army, Gas),
          DiplomacyUnit(Italy, Army, Mar)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Par).move(Bur),
          A(Bur).support(A(Gas).move(Mar)),
          A(Gas).move(Mar),
          A(Mar).hold()
        )
      )

      result.result should be(Set(
        new Executed(A(Par).move(Bur), Result.Bounced),
        new Executed(A(Bur).support(A(Gas).move(Mar)), Result.Success),
        new Executed(A(Gas).move(Mar), Result.Success),
        new Executed(A(Mar).hold(), Result.Dislodged(Gas.province))
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(France, Army, Par),
          DiplomacyUnit(France, Army, Bur),
          DiplomacyUnit(France, Army, Mar),
          DiplomacyUnit(Italy, Army, Mar)
        ),
        unitStatuses = Map(A(Mar) -> UnitStatus.Dislodged(Gas.province))
      ))
    }

    "handle a complex case containing convoys and supports." in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Turkey, Army, Tun),
          DiplomacyUnit(Turkey, Fleet, Tyn),
          DiplomacyUnit(France, Fleet, Rom),
          DiplomacyUnit(France, Fleet, Wes),
          DiplomacyUnit(Italy, Army, Ven),
          DiplomacyUnit(Italy, Fleet, Nap)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Tun).move(Nap),
          F(Tyn).convoy(A(Tun).move(Nap)),
          F(Wes).move(Tyn),
          F(Rom).support(F(Wes).move(Tyn)),
          A(Ven).move(Rom),
          F(Nap).support(A(Ven).move(Rom))
        )
      )

      result.result should be(Set(
        new Executed(A(Tun).move(Nap), Result.Bounced),
        new Executed(F(Tyn).convoy(A(Tun).move(Nap)), Result.Failed),
        new Executed(F(Wes).move(Tyn), Result.Bounced),
        new Executed(F(Rom).support(F(Wes).move(Tyn)), Result.Cut),
        new Executed(A(Ven).move(Rom), Result.Bounced),
        new Executed(F(Nap).support(A(Ven).move(Rom)), Result.Cut)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat
      ))
    }
  }
}
