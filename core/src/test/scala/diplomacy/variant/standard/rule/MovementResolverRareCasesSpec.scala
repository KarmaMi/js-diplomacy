package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.OrderResult
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._

class MovementResolverRareCasesSpec extends UnitSpec {
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
    "handle DIAGRAM 22" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Par),
          DiplomacyUnit(Power.France, $$.m.A, $$.Bur),
          DiplomacyUnit(Power.France, $$.m.A, $$.Mar)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Bur).hold(),
          $.A($.Par).move($.Bur),
          $.A($.Mar).support($.A($.Par).move($.Bur))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Bur).hold(), Result.Success),
        new Executed($.A($.Par).move($.Bur), Result.Bounced),
        new Executed($.A($.Mar).support($.A($.Par).move($.Bur)), Result.Failed)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat)
      ))
    }

    "handle DIAGRAM 23" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Par),
          DiplomacyUnit(Power.France, $$.m.A, $$.Bur),
          DiplomacyUnit(Power.Italy, $$.m.A, $$.Mar),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ruh)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Bur).move($.Mar),
          $.A($.Par).move($.Bur),
          $.A($.Mar).move($.Bur),
          $.A($.Ruh).support($.A($.Par).move($.Bur))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Bur).move($.Mar), Result.Bounced),
        new Executed($.A($.Par).move($.Bur), Result.Bounced),
        new Executed($.A($.Mar).move($.Bur), Result.Bounced),
        new Executed($.A($.Ruh).support($.A($.Par).move($.Bur)), Result.Failed)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat)
      ))
    }

    "handle DIAGRAM 24" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Par),
          DiplomacyUnit(Power.France, $$.m.A, $$.Bur),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Mun),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ruh)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Bur).hold(),
          $.A($.Par).support($.A($.Ruh).move($.Bur)),
          $.A($.Mun).hold(),
          $.A($.Ruh).move($.Bur)
        )
      )

      result.result should be(Set(
        new Executed($.A($.Bur).hold(), Result.Success),
        new Executed($.A($.Par).support($.A($.Ruh).move($.Bur)), Result.Failed),
        new Executed($.A($.Mun).hold(), Result.Success),
        new Executed($.A($.Ruh).move($.Bur), Result.Bounced)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat)
      ))
    }

    "handle DIAGRAM 25" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Boh),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Tyr),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Mun),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ruh),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Sil)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Boh).support($.A($.Sil).move($.Mun)),
          $.A($.Tyr).move($.Mun),
          $.A($.Mun).move($.Tyr),
          $.A($.Sil).move($.Mun),
          $.A($.Ruh).move($.Mun)
        )
      )

      result.result should be(Set(
        new Executed($.A($.Boh).support($.A($.Sil).move($.Mun)), Result.Failed),
        new Executed($.A($.Tyr).move($.Mun), Result.Bounced),
        new Executed($.A($.Mun).move($.Tyr), Result.Bounced),
        new Executed($.A($.Sil).move($.Mun), Result.Bounced),
        new Executed($.A($.Ruh).move($.Mun), Result.Bounced)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat)
      ))
    }

    "handle DIAGRAM 26" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.England, $$.m.F, $$.Hel),
          DiplomacyUnit(Power.England, $$.m.F, $$.Nth),
          DiplomacyUnit(Power.England, $$.m.F, $$.Den),
          DiplomacyUnit(Power.Germany, $$.m.F, $$.Ska),
          DiplomacyUnit(Power.Germany, $$.m.F, $$.Bal),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ber)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.F($.Den).move($.Kie),
          $.F($.Nth).move($.Den),
          $.F($.Hel).support($.F($.Nth).move($.Den)),
          $.A($.Ber).move($.Kie),
          $.F($.Ska).move($.Den),
          $.F($.Bal).support($.F($.Ska).move($.Den))
        )
      )

      result.result should be(Set(
        new Executed($.F($.Den).move($.Kie), Result.Bounced),
        new Executed($.F($.Nth).move($.Den), Result.Bounced),
        new Executed($.F($.Hel).support($.F($.Nth).move($.Den)), Result.Failed),
        new Executed($.A($.Ber).move($.Kie), Result.Bounced),
        new Executed($.F($.Ska).move($.Den), Result.Bounced),
        new Executed($.F($.Bal).support($.F($.Ska).move($.Den)), Result.Failed)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        provinceStatuses = Map($.Kie.province -> ProvinceStatus.Standoff)
      ))
    }

    "handle DIAGRAM 27" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Vie),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Ser),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Gal)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Vie).move($.Bud),
          $.A($.Ser).move($.Bud),
          $.A($.Gal).support($.A($.Ser).move($.Bud))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Vie).move($.Bud), Result.Bounced),
        new Executed($.A($.Ser).move($.Bud), Result.Success),
        new Executed($.A($.Gal).support($.A($.Ser).move($.Bud)), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Vie),
          DiplomacyUnit(Power.Austria, $$.m.A, $$.Bud),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Gal)
        )
      ))
    }

    "handle DIAGRAM 28" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.England, $$.m.A, $$.Lon),
          DiplomacyUnit(Power.England, $$.m.F, $$.Nth),
          DiplomacyUnit(Power.France, $$.m.A, $$.Bel),
          DiplomacyUnit(Power.France, $$.m.F, $$.Eng)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Lon).move($.Bel),
          $.F($.Nth).convoy($.A($.Lon).move($.Bel)),
          $.A($.Bel).move($.Lon),
          $.F($.Eng).convoy($.A($.Bel).move($.Lon))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Lon).move($.Bel), Result.Success),
        new Executed($.F($.Nth).convoy($.A($.Lon).move($.Bel)), Result.Success),
        new Executed($.A($.Bel).move($.Lon), Result.Success),
        new Executed($.F($.Eng).convoy($.A($.Bel).move($.Lon)), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.England, $$.m.A, $$.Bel),
          DiplomacyUnit(Power.England, $$.m.F, $$.Nth),
          DiplomacyUnit(Power.France, $$.m.A, $$.Lon),
          DiplomacyUnit(Power.France, $$.m.F, $$.Eng)
        )
      ))
    }

    "handle DIAGRAM 29" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.England, $$.m.A, $$.Lon),
          DiplomacyUnit(Power.England, $$.m.F, $$.Nth),
          DiplomacyUnit(Power.England, $$.m.F, $$.Eng),
          DiplomacyUnit(Power.France, $$.m.F, $$.Bre),
          DiplomacyUnit(Power.France, $$.m.F, $$.Iri)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Lon).move($.Bel),
          $.F($.Nth).convoy($.A($.Lon).move($.Bel)),
          $.F($.Eng).convoy($.A($.Lon).move($.Bel)),
          $.F($.Bre).move($.Eng),
          $.F($.Iri).support($.F($.Bre).move($.Eng))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Lon).move($.Bel), Result.Success),
        new Executed($.F($.Nth).convoy($.A($.Lon).move($.Bel)), Result.Success),
        new Executed($.F($.Eng).convoy($.A($.Lon).move($.Bel)), Result.Dislodged($.Bre.province)),
        new Executed($.F($.Bre).move($.Eng), Result.Success),
        new Executed($.F($.Iri).support($.F($.Bre).move($.Eng)), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.England, $$.m.A, $$.Bel),
          DiplomacyUnit(Power.England, $$.m.F, $$.Nth),
          DiplomacyUnit(Power.France, $$.m.F, $$.Eng),
          DiplomacyUnit(Power.France, $$.m.F, $$.Iri)
        ),
        unitStatuses = Map($.F($.Eng) -> UnitStatus.Dislodged($.Bre.province))
      ))
    }

    "handle DIAGRAM 30" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Tun),
          DiplomacyUnit(Power.France, $$.m.F, $$.Tyn),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Nap),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Ion)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Tun).move($.Nap),
          $.F($.Tyn).convoy($.A($.Tun).move($.Nap)),
          $.F($.Ion).move($.Tyn),
          $.F($.Nap).support($.F($.Ion).move($.Tyn))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Tun).move($.Nap), Result.Failed),
        new Executed($.F($.Tyn).convoy($.A($.Tun).move($.Nap)), Result.Dislodged($.Ion.province)),
        new Executed($.F($.Ion).move($.Tyn), Result.Success),
        new Executed($.F($.Nap).support($.F($.Ion).move($.Tyn)), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Tun),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Nap),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Tyn)
        ),
        unitStatuses = Map($.F($.Tyn) -> UnitStatus.Dislodged($.Ion.province))
      ))
    }

    "handle DIAGRAM 31" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Tun),
          DiplomacyUnit(Power.France, $$.m.F, $$.Tyn),
          DiplomacyUnit(Power.France, $$.m.F, $$.Ion),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Rom),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Nap)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Tun).move($.Nap),
          $.F($.Tyn).convoy($.A($.Tun).move($.Nap)),
          $.F($.Ion).convoy($.A($.Tun).move($.Nap)),
          $.F($.Rom).move($.Tyn),
          $.F($.Nap).support($.F($.Rom).move($.Tyn))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Tun).move($.Nap), Result.Bounced),
        new Executed($.F($.Tyn).convoy($.A($.Tun).move($.Nap)), Result.Failed),
        new Executed($.F($.Ion).convoy($.A($.Tun).move($.Nap)), Result.Failed),
        new Executed($.F($.Rom).move($.Tyn), Result.Bounced),
        new Executed($.F($.Nap).support($.F($.Rom).move($.Tyn)), Result.Cut)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat)
      ))
    }

    "handle DIAGRAM 32" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Tun),
          DiplomacyUnit(Power.France, $$.m.F, $$.Tyn),
          DiplomacyUnit(Power.France, $$.m.F, $$.Ion),
          DiplomacyUnit(Power.France, $$.m.A, $$.Apu),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Rom),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Nap)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Tun).move($.Nap),
          $.A($.Apu).support($.A($.Tun).move($.Nap)),
          $.F($.Tyn).convoy($.A($.Tun).move($.Nap)),
          $.F($.Ion).convoy($.A($.Tun).move($.Nap)),
          $.F($.Rom).move($.Tyn),
          $.F($.Nap).support($.F($.Rom).move($.Tyn))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Tun).move($.Nap), Result.Success),
        new Executed($.A($.Apu).support($.A($.Tun).move($.Nap)), Result.Success),
        new Executed($.F($.Tyn).convoy($.A($.Tun).move($.Nap)), Result.Success),
        new Executed($.F($.Ion).convoy($.A($.Tun).move($.Nap)), Result.Success),
        new Executed($.F($.Rom).move($.Tyn), Result.Bounced),
        new Executed($.F($.Nap).support($.F($.Rom).move($.Tyn)), Result.Dislodged($.Tun.province))
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Nap),
          DiplomacyUnit(Power.France, $$.m.F, $$.Tyn),
          DiplomacyUnit(Power.France, $$.m.F, $$.Ion),
          DiplomacyUnit(Power.France, $$.m.A, $$.Apu),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Rom)
        ),
        unitStatuses = Map($.F($.Nap) -> UnitStatus.Dislodged($.Tun.province))
      ))
    }
  }
}
