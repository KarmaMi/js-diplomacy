package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.OrderResult
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map.Power
import diplomacy.variant.standard.map.Keywords._
import diplomacy.variant.standard.board.{ Turn => T}
import diplomacy.variant.standard.board.Keywords._
import diplomacy.variant.standard.board.Implicits._
import diplomacy.variant.standard.rule.Keywords._
import diplomacy.variant.standard.rule.Implicits._

class MovementResolverSupportOrderSpec extends UnitSpec with UsesResolvedResult {
  val resolver = new MovementResolver() {
    type Turn = T
    type Power = map.Power
  }

  "A movement-resolver" should {
    "handle DIAGRAM 8" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Army, Gas),
          DiplomacyUnit(France, Army, Mar),
          DiplomacyUnit(Germany, Army, Bur)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Mar).move(Bur),
          A(Gas).support(A(Mar).move(Bur)),
          A(Bur).hold()
        )
      )

      result.result should be(Set(
        new Executed(A(Mar).move(Bur), Result.Success),
        new Executed(A(Gas).support(A(Mar).move(Bur)), Result.Success),
        new Executed(A(Bur).hold(), Result.Dislodged(Mar.province))
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(France, Army, Gas),
          DiplomacyUnit(France, Army, Bur),
          DiplomacyUnit(Germany, Army, Bur)
        ),
        unitStatuses = Map(
          A(Bur) -> UnitStatus.Dislodged(Mar.province)
        )
      ))
    }

    "handle DIAGRAM 9" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Germany, Fleet, Bal),
          DiplomacyUnit(Germany, Army, Sil),
          DiplomacyUnit(Russia, Army, Pru)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Sil).move(Pru),
          F(Bal).support(A(Sil).move(Pru)),
          A(Pru).hold())
      )

      result.result should be(Set(
        new Executed(A(Sil).move(Pru), Result.Success),
        new Executed(F(Bal).support(A(Sil).move(Pru)), Result.Success),
        new Executed(A(Pru).hold(), Result.Dislodged(Sil.province))
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(Germany, Fleet, Bal),
          DiplomacyUnit(Germany, Army, Pru),
          DiplomacyUnit(Russia, Army, Pru)
        ),
        unitStatuses = Map(
          A(Pru) -> UnitStatus.Dislodged(Sil.province)
        )
      ))
    }

    "handle DIAGRAM 10" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Fleet, GoL),
          DiplomacyUnit(France, Fleet, Wes),
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
          F(GoL).move(Tyn),
          F(Wes).support(F(GoL).move(Tyn)),
          F(Nap).move(Tyn),
          F(Rom).support(F(Nap).move(Tyn))
        )
      )

      result.result should be(Set(
        new Executed(F(GoL).move(Tyn), Result.Bounced),
        new Executed(F(Wes).support(F(GoL).move(Tyn)), Result.Failed),
        new Executed(F(Nap).move(Tyn), Result.Bounced),
        new Executed(F(Rom).support(F(Nap).move(Tyn)), Result.Failed)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        provinceStatuses = Map(Tyn.province -> ProvinceStatus.Standoff)
      ))
    }

    "handle DIAGRAM 11" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(France, Fleet, GoL),
          DiplomacyUnit(France, Fleet, Wes),
          DiplomacyUnit(Italy, Fleet, Rom),
          DiplomacyUnit(Italy, Fleet, Tyn)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          F(GoL).move(Tyn),
          F(Wes).support(F(GoL).move(Tyn)),
          F(Tyn).hold(),
          F(Rom).support(F(Tyn).hold())
        )
      )

      result.result should be(Set(
        new Executed(F(GoL).move(Tyn), Result.Bounced),
        new Executed(F(Wes).support(F(GoL).move(Tyn)), Result.Failed),
        new Executed(F(Tyn).hold(), Result.Success),
        new Executed(F(Rom).support(F(Tyn).hold()), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat
      ))
    }

    "handle DIAGRAM 12" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Austria, Army, Boh),
          DiplomacyUnit(Austria, Army, Tyr),
          DiplomacyUnit(Germany, Army, Ber),
          DiplomacyUnit(Germany, Army, Mun),
          DiplomacyUnit(Russia, Army, Pru),
          DiplomacyUnit(Russia, Army, War)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Boh).move(Mun),
          A(Tyr).support(A(Boh).move(Mun)),
          A(Mun).move(Sil),
          A(Tyr).support(A(Mun).move(Sil)),
          A(War).move(Sil),
          A(Pru).support(A(War).move(Sil))
        )
      )

      result.result should be(Set(
        new Executed(A(Boh).move(Mun), Result.Success),
        new Executed(A(Tyr).support(A(Boh).move(Mun)), Result.Success),
        new Executed(A(Mun).move(Sil), Result.Dislodged(Boh.province)),
        new Executed(A(Tyr).support(A(Mun).move(Sil)), Result.Failed),
        new Executed(A(War).move(Sil), Result.Bounced),
        new Executed(A(Pru).support(A(War).move(Sil)), Result.Failed)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(Austria, Army, Mun),
          DiplomacyUnit(Austria, Army, Tyr),
          DiplomacyUnit(Germany, Army, Ber),
          DiplomacyUnit(Germany, Army, Mun),
          DiplomacyUnit(Russia, Army, Pru),
          DiplomacyUnit(Russia, Army, War)
        ),
        unitStatuses = Map(
          A(Mun) -> UnitStatus.Dislodged(Boh.province)
        ),
        provinceStatuses = Map(Sil.province -> ProvinceStatus.Standoff)
      ))
    }

    "handle DIAGRAM 13" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Austria, Army, Ser),
          DiplomacyUnit(Austria, Army, Rum),
          DiplomacyUnit(Austria, Army, Sev),
          DiplomacyUnit(Turkey, Army, Bul)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Rum).move(Bul),
          A(Ser).support(A(Rum).move(Bul)),
          A(Sev).move(Rum),
          A(Bul).move(Rum)
        )
      )

      result.result should be(Set(
        new Executed(A(Rum).move(Bul), Result.Success),
        new Executed(A(Ser).support(A(Rum).move(Bul)), Result.Success),
        new Executed(A(Sev).move(Rum), Result.Success),
        new Executed(A(Bul).move(Rum), Result.Dislodged(Rum.province))
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(Austria, Army, Ser),
          DiplomacyUnit(Austria, Army, Bul),
          DiplomacyUnit(Austria, Army, Rum),
          DiplomacyUnit(Turkey, Army, Bul)
        ),
        unitStatuses = Map(
          A(Bul) -> UnitStatus.Dislodged(Rum.province)
        )
      ))
    }

    "handle DIAGRAM 14" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Austria, Army, Ser),
          DiplomacyUnit(Austria, Army, Rum),
          DiplomacyUnit(Austria, Army, Sev),
          DiplomacyUnit(Austria, Army, Gre),
          DiplomacyUnit(Turkey, Army, Bul),
          DiplomacyUnit(Turkey, Fleet, Bla)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Rum).move(Bul),
          A(Ser).support(A(Rum).move(Bul)),
          A(Gre).support(A(Rum).move(Bul)),
          A(Sev).move(Rum),
          A(Bul).move(Rum),
          F(Bla).support(A(Bul).move(Rum))
        )
      )

      result.result should be(Set(
        new Executed(A(Rum).move(Bul), Result.Success),
        new Executed(A(Ser).support(A(Rum).move(Bul)), Result.Success),
        new Executed(A(Gre).support(A(Rum).move(Bul)), Result.Success),
        new Executed(A(Sev).move(Rum), Result.Success),
        new Executed(A(Bul).move(Rum), Result.Dislodged(Rum.province)),
        new Executed(F(Bla).support(A(Bul).move(Rum)), Result.Failed)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(Austria, Army, Ser),
          DiplomacyUnit(Austria, Army, Bul),
          DiplomacyUnit(Austria, Army, Gre),
          DiplomacyUnit(Austria, Army, Rum),
          DiplomacyUnit(Turkey, Fleet, Bla),
          DiplomacyUnit(Turkey, Army, Bul)
        ),
        unitStatuses = Map(
          A(Bul) -> UnitStatus.Dislodged(Rum.province)
        )
      ))
    }

    "handle DIAGRAM 15" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Germany, Army, Pru),
          DiplomacyUnit(Germany, Army, Sil),
          DiplomacyUnit(Russia, Army, Boh),
          DiplomacyUnit(Russia, Army, War)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Pru).move(War),
          A(Sil).support(A(Pru).move(War)),
          A(War).hold(),
          A(Boh).move(Sil)
        )
      )

      result.result should be(Set(
        new Executed(A(Pru).move(War), Result.Bounced),
        new Executed(A(Sil).support(A(Pru).move(War)), Result.Cut),
        new Executed(A(War).hold(), Result.Success),
        new Executed(A(Boh).move(Sil), Result.Bounced)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat
      ))
    }

    "handle DIAGRAM 16" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Germany, Army, Pru),
          DiplomacyUnit(Germany, Army, Sil),
          DiplomacyUnit(Russia, Army, War)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Pru).move(War),
          A(Sil).support(A(Pru).move(War)),
          A(War).move(Sil)
        )
      )

      result.result should be(Set(
        new Executed(A(Pru).move(War), Result.Success),
        new Executed(A(Sil).support(A(Pru).move(War)), Result.Success),
        new Executed(A(War).move(Sil), Result.Dislodged(Pru.province))
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(Germany, Army, War),
          DiplomacyUnit(Germany, Army, Sil),
          DiplomacyUnit(Russia, Army, War)
        ),
        unitStatuses = Map(
          A(War) -> UnitStatus.Dislodged(Pru.province)
        )
      ))
    }

    "handle DIAGRAM 17" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Germany, Army, Ber),
          DiplomacyUnit(Germany, Army, Sil),
          DiplomacyUnit(Russia, Fleet, Bal),
          DiplomacyUnit(Russia, Army, Pru),
          DiplomacyUnit(Russia, Army, War)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Ber).move(Pru),
          A(Sil).support(A(Ber).move(Pru)),
          F(Bal).move(Pru),
          A(Pru).move(Sil),
          A(War).support(A(Pru).move(Sil))
        )
      )

      result.result should be(Set(
        new Executed(A(Ber).move(Pru), Result.Bounced),
        new Executed(A(Sil).support(A(Ber).move(Pru)), Result.Dislodged(Pru.province)),
        new Executed(F(Bal).move(Pru), Result.Bounced),
        new Executed(A(Pru).move(Sil), Result.Success),
        new Executed(A(War).support(A(Pru).move(Sil)), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(Germany, Army, Ber),
          DiplomacyUnit(Germany, Army, Sil),
          DiplomacyUnit(Russia, Fleet, Bal),
          DiplomacyUnit(Russia, Army, Sil),
          DiplomacyUnit(Russia, Army, War)
        ),
        unitStatuses = Map(
          A(Sil) -> UnitStatus.Dislodged(Pru.province)
        ),
        provinceStatuses = Map(Pru.province -> ProvinceStatus.Standoff)
      ))
    }

    "handle DIAGRAM 18" in {
      val board = new resolver.Board(
        map.map, 1901.Spring - Movement,
        Set(
          DiplomacyUnit(Germany, Army, Ber),
          DiplomacyUnit(Germany, Army, Mun),
          DiplomacyUnit(Russia, Army, Pru),
          DiplomacyUnit(Russia, Army, Sil),
          DiplomacyUnit(Russia, Army, Boh),
          DiplomacyUnit(Russia, Army, Tyr)
        ),
        Map(), Map(), Map()
      )

      val $ = StandardRuleOrderHelper(board)
      import $._
      val Right(result) = resolver(
        board,
        Set(
          A(Ber).hold(),
          A(Mun).move(Sil),
          A(Pru).move(Ber),
          A(Sil).support(A(Pru).move(Ber)),
          A(Boh).move(Mun),
          A(Tyr).support(A(Boh).move(Mun))
        )
      )

      result.result should be(Set(
        new Executed(A(Ber).hold(), Result.Success),
        new Executed(A(Mun).move(Sil), Result.Dislodged(Boh.province)),
        new Executed(A(Pru).move(Ber), Result.Bounced),
        new Executed(A(Sil).support(A(Pru).move(Ber)), Result.Cut),
        new Executed(A(Boh).move(Mun), Result.Success),
        new Executed(A(Tyr).support(A(Boh).move(Mun)), Result.Success)
      ))
      result.board should be(board.copy(
        state = 1901.Spring - Retreat,
        units = Set(
          DiplomacyUnit(Germany, Army, Ber),
          DiplomacyUnit(Germany, Army, Mun),
          DiplomacyUnit(Russia, Army, Pru),
          DiplomacyUnit(Russia, Army, Sil),
          DiplomacyUnit(Russia, Army, Mun),
          DiplomacyUnit(Russia, Army, Tyr)
        ),
        unitStatuses = Map(
          A(Mun) -> UnitStatus.Dislodged(Boh.province)
        )
      ))
    }
  }
}
