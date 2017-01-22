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

class MovementResolverRareCasesSpec extends UnitSpec {
  val resolver = new MovementResolver() {
    type Turn = T
    type Power = map.Power
  }

  type Executed =
    OrderResult.Executed[resolver.Power, resolver.MilitaryBranch, resolver.Order, resolver.Result]

  "A movement-resolver" should {
    "handle DIAGRAM 22" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Army, Par),
          DiplomacyUnit(France, Army, Bur),
          DiplomacyUnit(France, Army, Mar)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._

      val Right(result) = resolver(
        board,
        Set(
          A(Bur).hold(),
          A(Par).move(Bur),
          A(Mar).support(A(Par).move(Bur))
        )
      )

      result.result should be(Set(
        new Executed(A(Bur).hold(), Result.Success),
        new Executed(A(Par).move(Bur), Result.Bounced),
        new Executed(A(Mar).support(A(Par).move(Bur)), Result.Failed)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat
      ))
    }

    "handle DIAGRAM 23" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Army, Par),
          DiplomacyUnit(France, Army, Bur),
          DiplomacyUnit(Italy, Army, Mar),
          DiplomacyUnit(Germany, Army, Ruh)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._

      val Right(result) = resolver(
        board,
        Set(
          A(Bur).move(Mar),
          A(Par).move(Bur),
          A(Mar).move(Bur),
          A(Ruh).support(A(Par).move(Bur))
        )
      )

      result.result should be(Set(
        new Executed(A(Bur).move(Mar), Result.Bounced),
        new Executed(A(Par).move(Bur), Result.Bounced),
        new Executed(A(Mar).move(Bur), Result.Bounced),
        new Executed(A(Ruh).support(A(Par).move(Bur)), Result.Failed)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat
      ))
    }

    "handle DIAGRAM 24" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Army, Par),
          DiplomacyUnit(France, Army, Bur),
          DiplomacyUnit(Germany, Army, Mun),
          DiplomacyUnit(Germany, Army, Ruh)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._

      val Right(result) = resolver(
        board,
        Set(
          A(Bur).hold(),
          A(Par).support(A(Ruh).move(Bur)),
          A(Mun).hold(),
          A(Ruh).move(Bur)
        )
      )

      result.result should be(Set(
        new Executed(A(Bur).hold(), Result.Success),
        new Executed(A(Par).support(A(Ruh).move(Bur)), Result.Failed),
        new Executed(A(Mun).hold(), Result.Success),
        new Executed(A(Ruh).move(Bur), Result.Bounced)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat
      ))
    }

    "handle DIAGRAM 25" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Austria, Army, Boh),
          DiplomacyUnit(Austria, Army, Tyr),
          DiplomacyUnit(Germany, Army, Mun),
          DiplomacyUnit(Germany, Army, Ruh),
          DiplomacyUnit(Germany, Army, Sil)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)

      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Boh).support(A(Sil).move(Mun)),
          A(Tyr).move(Mun),
          A(Mun).move(Tyr),
          A(Sil).move(Mun),
          A(Ruh).move(Mun)
        )
      )

      result.result should be(Set(
        new Executed(A(Boh).support(A(Sil).move(Mun)), Result.Failed),
        new Executed(A(Tyr).move(Mun), Result.Bounced),
        new Executed(A(Mun).move(Tyr), Result.Bounced),
        new Executed(A(Sil).move(Mun), Result.Bounced),
        new Executed(A(Ruh).move(Mun), Result.Bounced)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat
      ))
    }

    "handle DIAGRAM 26" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(England, Fleet, Hel),
          DiplomacyUnit(England, Fleet, Nth),
          DiplomacyUnit(England, Fleet, Den),
          DiplomacyUnit(Germany, Fleet, Ska),
          DiplomacyUnit(Germany, Fleet, Bal),
          DiplomacyUnit(Germany, Army, Ber)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)

      import $._
      val Right(result) = resolver(
        board,
        Set(
          F(Den).move(Kie),
          F(Nth).move(Den),
          F(Hel).support(F(Nth).move(Den)),
          A(Ber).move(Kie),
          F(Ska).move(Den),
          F(Bal).support(F(Ska).move(Den))
        )
      )

      result.result should be(Set(
        new Executed(F(Den).move(Kie), Result.Bounced),
        new Executed(F(Nth).move(Den), Result.Bounced),
        new Executed(F(Hel).support(F(Nth).move(Den)), Result.Failed),
        new Executed(A(Ber).move(Kie), Result.Bounced),
        new Executed(F(Ska).move(Den), Result.Bounced),
        new Executed(F(Bal).support(F(Ska).move(Den)), Result.Failed)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        provinceStatuses = Map(Kie.province -> ProvinceStatus.Standoff)
      ))
    }

    "handle DIAGRAM 27" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Austria, Army, Vie),
          DiplomacyUnit(Austria, Army, Ser),
          DiplomacyUnit(Russia, Army, Gal)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)

      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Vie).move(Bud),
          A(Ser).move(Bud),
          A(Gal).support(A(Ser).move(Bud))
        )
      )

      result.result should be(Set(
        new Executed(A(Vie).move(Bud), Result.Bounced),
        new Executed(A(Ser).move(Bud), Result.Success),
        new Executed(A(Gal).support(A(Ser).move(Bud)), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(Austria, Army, Vie),
          DiplomacyUnit(Austria, Army, Bud),
          DiplomacyUnit(Russia, Army, Gal)
        )
      ))
    }

    "handle DIAGRAM 28" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(England, Army, Lon),
          DiplomacyUnit(England, Fleet, Nth),
          DiplomacyUnit(France, Army, Bel),
          DiplomacyUnit(France, Fleet, Eng)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)

      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Lon).move(Bel),
          F(Nth).convoy(A(Lon).move(Bel)),
          A(Bel).move(Lon),
          F(Eng).convoy(A(Bel).move(Lon))
        )
      )

      result.result should be(Set(
        new Executed(A(Lon).move(Bel), Result.Success),
        new Executed(F(Nth).convoy(A(Lon).move(Bel)), Result.Success),
        new Executed(A(Bel).move(Lon), Result.Success),
        new Executed(F(Eng).convoy(A(Bel).move(Lon)), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(England, Army, Bel),
          DiplomacyUnit(England, Fleet, Nth),
          DiplomacyUnit(France, Army, Lon),
          DiplomacyUnit(France, Fleet, Eng)
        )
      ))
    }

    "handle DIAGRAM 29" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(England, Army, Lon),
          DiplomacyUnit(England, Fleet, Nth),
          DiplomacyUnit(England, Fleet, Eng),
          DiplomacyUnit(France, Fleet, Bre),
          DiplomacyUnit(France, Fleet, Iri)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)

      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Lon).move(Bel),
          F(Nth).convoy(A(Lon).move(Bel)),
          F(Eng).convoy(A(Lon).move(Bel)),
          F(Bre).move(Eng),
          F(Iri).support(F(Bre).move(Eng))
        )
      )

      result.result should be(Set(
        new Executed(A(Lon).move(Bel), Result.Success),
        new Executed(F(Nth).convoy(A(Lon).move(Bel)), Result.Success),
        new Executed(F(Eng).convoy(A(Lon).move(Bel)), Result.Dislodged(Bre.province)),
        new Executed(F(Bre).move(Eng), Result.Success),
        new Executed(F(Iri).support(F(Bre).move(Eng)), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(England, Army, Bel),
          DiplomacyUnit(England, Fleet, Nth),
          DiplomacyUnit(England, Fleet, Eng),
          DiplomacyUnit(France, Fleet, Eng),
          DiplomacyUnit(France, Fleet, Iri)
        ),
        unitStatuses = Map(F(Eng) -> UnitStatus.Dislodged(Bre.province))
      ))
    }

    "handle DIAGRAM 30" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Army, Tun),
          DiplomacyUnit(France, Fleet, Tyn),
          DiplomacyUnit(Italy, Fleet, Nap),
          DiplomacyUnit(Italy, Fleet, Ion)
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
          F(Ion).move(Tyn),
          F(Nap).support(F(Ion).move(Tyn))
        )
      )

      result.result should be(Set(
        new Executed(A(Tun).move(Nap), Result.Failed),
        new Executed(F(Tyn).convoy(A(Tun).move(Nap)), Result.Dislodged(Ion.province)),
        new Executed(F(Ion).move(Tyn), Result.Success),
        new Executed(F(Nap).support(F(Ion).move(Tyn)), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(France, Army, Tun),
          DiplomacyUnit(France, Fleet, Tyn),
          DiplomacyUnit(Italy, Fleet, Nap),
          DiplomacyUnit(Italy, Fleet, Tyn)
        ),
        unitStatuses = Map(F(Tyn) -> UnitStatus.Dislodged(Ion.province))
      ))
    }

    "handle DIAGRAM 31" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Army, Tun),
          DiplomacyUnit(France, Fleet, Tyn),
          DiplomacyUnit(France, Fleet, Ion),
          DiplomacyUnit(Italy, Fleet, Rom),
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
          F(Ion).convoy(A(Tun).move(Nap)),
          F(Rom).move(Tyn),
          F(Nap).support(F(Rom).move(Tyn))
        )
      )

      result.result should be(Set(
        new Executed(A(Tun).move(Nap), Result.Bounced),
        new Executed(F(Tyn).convoy(A(Tun).move(Nap)), Result.Failed),
        new Executed(F(Ion).convoy(A(Tun).move(Nap)), Result.Failed),
        new Executed(F(Rom).move(Tyn), Result.Bounced),
        new Executed(F(Nap).support(F(Rom).move(Tyn)), Result.Cut)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat
      ))
    }

    "handle DIAGRAM 32" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Army, Tun),
          DiplomacyUnit(France, Fleet, Tyn),
          DiplomacyUnit(France, Fleet, Ion),
          DiplomacyUnit(France, Army, Apu),
          DiplomacyUnit(Italy, Fleet, Rom),
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
          A(Apu).support(A(Tun).move(Nap)),
          F(Tyn).convoy(A(Tun).move(Nap)),
          F(Ion).convoy(A(Tun).move(Nap)),
          F(Rom).move(Tyn),
          F(Nap).support(F(Rom).move(Tyn))
        )
      )

      result.result should be(Set(
        new Executed(A(Tun).move(Nap), Result.Success),
        new Executed(A(Apu).support(A(Tun).move(Nap)), Result.Success),
        new Executed(F(Tyn).convoy(A(Tun).move(Nap)), Result.Success),
        new Executed(F(Ion).convoy(A(Tun).move(Nap)), Result.Success),
        new Executed(F(Rom).move(Tyn), Result.Bounced),
        new Executed(F(Nap).support(F(Rom).move(Tyn)), Result.Dislodged(Tun.province))
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(France, Army, Nap),
          DiplomacyUnit(France, Fleet, Tyn),
          DiplomacyUnit(France, Fleet, Ion),
          DiplomacyUnit(France, Army, Apu),
          DiplomacyUnit(Italy, Fleet, Rom),
          DiplomacyUnit(Italy, Fleet, Nap)
        ),
        unitStatuses = Map(F(Nap) -> UnitStatus.Dislodged(Tun.province))
      ))
    }
  }
}
