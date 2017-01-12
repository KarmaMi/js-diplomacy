package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.OrderResult
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._

class MovementResolverSupportOrderSpec extends UnitSpec {
  val resolver = new MovementResolver() {
    type Turn = map.Turn
    type Power = map.Power
  }
  val $$ = DiplomacyMapHelper(map.map)
  val orderHelper = new OrderHelper[map.Power]() {}
  import orderHelper._

  type Executed =
    OrderResult.Executed[resolver.Power, resolver.MilitaryBranch, resolver.Order, resolver.Result]

  "A movement-resolver" should {
    "handle DIAGRAM 8" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Gas),
          DiplomacyUnit(Power.France, $$.m.A, $$.Mar),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Bur)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Mar).move($.Bur),
          $.A($.Gas).support($.A($.Mar).move($.Bur)),
          $.A($.Bur).hold()
        )
      )

      result.result should be(Set(
        new Executed($.A($.Mar).move($.Bur), Result.Success),
        new Executed($.A($.Gas).support($.A($.Mar).move($.Bur)), Result.Success),
        new Executed($.A($.Bur).hold(), Result.Dislodged($.Mar.province))
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Gas),
          DiplomacyUnit(Power.France, $$.m.A, $$.Bur)
        ),
        unitStatuses = Map(
          $.A($.Bur) -> UnitStatus.Dislodged($.Mar.province)
        )
      ))
    }

    "handle DIAGRAM 9" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Germany, $$.m.F, $$.Bal),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Sil),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Pru)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Sil).move($.Pru),
          $.F($.Bal).support($.A($.Sil).move($.Pru)),
          $.A($.Pru).hold())
      )

      result.result should be(Set(
        new Executed($.A($.Sil).move($.Pru), Result.Success),
        new Executed($.F($.Bal).support($.A($.Sil).move($.Pru)), Result.Success),
        new Executed($.A($.Pru).hold(), Result.Dislodged($.Sil.province))
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.Germany, $$.m.F, $$.Bal),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Pru)
        ),
        unitStatuses = Map(
          $.A($.Pru) -> UnitStatus.Dislodged($.Sil.province)
        )
      ))
    }

    "handle DIAGRAM 10" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.F, $$.GoL),
          DiplomacyUnit(Power.France, $$.m.F, $$.Wes),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Rom),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Nap)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.F($.GoL).move($.Tyn),
          $.F($.Wes).support($.F($.GoL).move($.Tyn)),
          $.F($.Nap).move($.Tyn),
          $.F($.Rom).support($.F($.Nap).move($.Tyn))
        )
      )

      result.result should be(Set(
        new Executed($.F($.GoL).move($.Tyn), Result.Bounced),
        new Executed($.F($.Wes).support($.F($.GoL).move($.Tyn)), Result.Failed),
        new Executed($.F($.Nap).move($.Tyn), Result.Bounced),
        new Executed($.F($.Rom).support($.F($.Nap).move($.Tyn)), Result.Failed)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        provinceStatuses = Map($.Tyn.province -> ProvinceStatus.Standoff)
      ))
    }

    "handle DIAGRAM 11" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.F, $$.GoL),
          DiplomacyUnit(Power.France, $$.m.F, $$.Wes),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Rom),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Tyn)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.F($.GoL).move($.Tyn),
          $.F($.Wes).support($.F($.GoL).move($.Tyn)),
          $.F($.Tyn).hold(),
          $.F($.Rom).support($.F($.Tyn).hold())
        )
      )

      result.result should be(Set(
        new Executed($.F($.GoL).move($.Tyn), Result.Bounced),
        new Executed($.F($.Wes).support($.F($.GoL).move($.Tyn)), Result.Failed),
        new Executed($.F($.Tyn).hold(), Result.Success),
        new Executed($.F($.Rom).support($.F($.Tyn).hold()), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat)
      ))
    }

    "handle DIAGRAM 12" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Boh),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Tyr),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ber),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Mun),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Pru),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.War)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Boh).move($.Mun),
          $.A($.Tyr).support($.A($.Boh).move($.Mun)),
          $.A($.Mun).move($.Sil),
          $.A($.Tyr).support($.A($.Mun).move($.Sil)),
          $.A($.War).move($.Sil),
          $.A($.Pru).support($.A($.War).move($.Sil))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Boh).move($.Mun), Result.Success),
        new Executed($.A($.Tyr).support($.A($.Boh).move($.Mun)), Result.Success),
        new Executed($.A($.Mun).move($.Sil), Result.Dislodged($.Boh.province)),
        new Executed($.A($.Tyr).support($.A($.Mun).move($.Sil)), Result.Failed),
        new Executed($.A($.War).move($.Sil), Result.Bounced),
        new Executed($.A($.Pru).support($.A($.War).move($.Sil)), Result.Failed)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Mun),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Tyr),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ber),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Pru),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.War)
        ),
        unitStatuses = Map(
          $.A($.Mun) -> UnitStatus.Dislodged($.Boh.province)
        ),
        provinceStatuses = Map($.Sil.province -> ProvinceStatus.Standoff)
      ))
    }

    "handle DIAGRAM 13" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Ser),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Rum),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Sev),
          DiplomacyUnit(Power.Turkey, $$.m.A, $$.Bul)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Rum).move($.Bul),
          $.A($.Ser).support($.A($.Rum).move($.Bul)),
          $.A($.Sev).move($.Rum),
          $.A($.Bul).move($.Rum)
        )
      )

      result.result should be(Set(
        new Executed($.A($.Rum).move($.Bul), Result.Success),
        new Executed($.A($.Ser).support($.A($.Rum).move($.Bul)), Result.Success),
        new Executed($.A($.Sev).move($.Rum), Result.Success),
        new Executed($.A($.Bul).move($.Rum), Result.Dislodged($.Rum.province))
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Ser),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Bul),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Rum)
        ),
        unitStatuses = Map(
          $.A($.Bul) -> UnitStatus.Dislodged($.Rum.province)
        )
      ))
    }

    "handle DIAGRAM 14" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Ser),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Rum),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Sev),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Gre),
          DiplomacyUnit(Power.Turkey, $$.m.A, $$.Bul),
          DiplomacyUnit(Power.Turkey, $$.m.F, $$.Bla)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Rum).move($.Bul),
          $.A($.Ser).support($.A($.Rum).move($.Bul)),
          $.A($.Gre).support($.A($.Rum).move($.Bul)),
          $.A($.Sev).move($.Rum),
          $.A($.Bul).move($.Rum),
          $.F($.Bla).support($.A($.Bul).move($.Rum))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Rum).move($.Bul), Result.Success),
        new Executed($.A($.Ser).support($.A($.Rum).move($.Bul)), Result.Success),
        new Executed($.A($.Gre).support($.A($.Rum).move($.Bul)), Result.Success),
        new Executed($.A($.Sev).move($.Rum), Result.Success),
        new Executed($.A($.Bul).move($.Rum), Result.Dislodged($.Rum.province)),
        new Executed($.F($.Bla).support($.A($.Bul).move($.Rum)), Result.Failed)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Ser),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Bul),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Gre),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Rum),
          DiplomacyUnit(Power.Turkey, $$.m.F, $$.Bla)
        ),
        unitStatuses = Map(
          $.A($.Bul) -> UnitStatus.Dislodged($.Rum.province)
        )
      ))
    }

    "handle DIAGRAM 15" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Pru),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Sil),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Boh),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.War)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Pru).move($.War),
          $.A($.Sil).support($.A($.Pru).move($.War)),
          $.A($.War).hold(),
          $.A($.Boh).move($.Sil)
        )
      )

      result.result should be(Set(
        new Executed($.A($.Pru).move($.War), Result.Bounced),
        new Executed($.A($.Sil).support($.A($.Pru).move($.War)), Result.Cut),
        new Executed($.A($.War).hold(), Result.Success),
        new Executed($.A($.Boh).move($.Sil), Result.Bounced)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat)
      ))
    }

    "handle DIAGRAM 16" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Pru),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Sil),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.War)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Pru).move($.War),
          $.A($.Sil).support($.A($.Pru).move($.War)),
          $.A($.War).move($.Sil)
        )
      )

      result.result should be(Set(
        new Executed($.A($.Pru).move($.War), Result.Success),
        new Executed($.A($.Sil).support($.A($.Pru).move($.War)), Result.Success),
        new Executed($.A($.War).move($.Sil), Result.Dislodged($.Pru.province))
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.War),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Sil)
        ),
        unitStatuses = Map(
          $.A($.War) -> UnitStatus.Dislodged($.Pru.province)
        )
      ))
    }

    "handle DIAGRAM 17" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ber),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Sil),
          DiplomacyUnit(Power.Russia, $$.m.F, $$.Bal),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Pru),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.War)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Ber).move($.Pru),
          $.A($.Sil).support($.A($.Ber).move($.Pru)),
          $.F($.Bal).move($.Pru),
          $.A($.Pru).move($.Sil),
          $.A($.War).support($.A($.Pru).move($.Sil))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Ber).move($.Pru), Result.Bounced),
        new Executed($.A($.Sil).support($.A($.Ber).move($.Pru)), Result.Dislodged($.Pru.province)),
        new Executed($.F($.Bal).move($.Pru), Result.Bounced),
        new Executed($.A($.Pru).move($.Sil), Result.Success),
        new Executed($.A($.War).support($.A($.Pru).move($.Sil)), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ber),
          DiplomacyUnit(Power.Russia, $$.m.F, $$.Bal),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Sil),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.War)
        ),
        unitStatuses = Map(
          $.A($.Sil) -> UnitStatus.Dislodged($.Pru.province)
        ),
        provinceStatuses = Map($.Pru.province -> ProvinceStatus.Standoff)
      ))
    }

    "handle DIAGRAM 18" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ber),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Mun),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Pru),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Sil),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Boh),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Tyr)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Ber).hold(),
          $.A($.Mun).move($.Sil),
          $.A($.Pru).move($.Ber),
          $.A($.Sil).support($.A($.Pru).move($.Ber)),
          $.A($.Boh).move($.Mun),
          $.A($.Tyr).support($.A($.Boh).move($.Mun))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Ber).hold(), Result.Success),
        new Executed($.A($.Mun).move($.Sil), Result.Dislodged($.Boh.province)),
        new Executed($.A($.Pru).move($.Ber), Result.Bounced),
        new Executed($.A($.Sil).support($.A($.Pru).move($.Ber)), Result.Cut),
        new Executed($.A($.Boh).move($.Mun), Result.Success),
        new Executed($.A($.Tyr).support($.A($.Boh).move($.Mun)), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ber),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Pru),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Sil),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Mun),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Tyr)
        ),
        unitStatuses = Map(
          $.A($.Mun) -> UnitStatus.Dislodged($.Boh.province)
        )
      ))
    }
  }
}
