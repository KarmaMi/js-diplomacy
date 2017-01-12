package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.OrderResult
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._

class MovementResolverOtherCasesSpec extends UnitSpec {
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
    "handle the case when a support order has no corresponding order." in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Par),
          DiplomacyUnit(Power.France, $$.m.A, $$.Mar)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Par).move($.Bur),
          $.A($.Mar).support($.A($.Par).move($.Gas))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Par).move($.Bur), Result.Success),
        new Executed($.A($.Mar).support($.A($.Par).move($.Gas)), Result.NoCorrespondingOrder)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Bur),
          DiplomacyUnit(Power.France, $$.m.A, $$.Mar)
        )
      ))
    }

    "handle the case when a convoy order has no corresponding order." in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Bre),
          DiplomacyUnit(Power.France, $$.m.F, $$.Eng)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Bre).move($.Par),
          $.F($.Eng).convoy($.A($.Bre).move($.Lon))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Bre).move($.Par), Result.Success),
        new Executed($.F($.Eng).convoy($.A($.Bre).move($.Lon)), Result.NoCorrespondingOrder)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Par),
          DiplomacyUnit(Power.France, $$.m.F, $$.Eng)
        )
      ))
    }

    "swap locations using convoy (1)." in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Pru),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ber),
          DiplomacyUnit(Power.Germany, $$.m.F, $$.Bal)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Pru).move($.Ber),
          $.A($.Ber).move($.Pru),
          $.F($.Bal).convoy($.A($.Pru).move($.Ber))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Pru).move($.Ber), Result.Success),
        new Executed($.A($.Ber).move($.Pru), Result.Success),
        new Executed($.F($.Bal).convoy($.A($.Pru).move($.Ber)), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat)
      ))
    }

    "swap locations using convoy (2)." in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ber),
          DiplomacyUnit(Power.Germany, $$.m.F, $$.Bal),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Pru),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Sil)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Pru).move($.Ber),
          $.A($.Sil).support($.A($.Pru).move($.Ber)),
          $.A($.Ber).move($.Pru),
          $.F($.Bal).convoy($.A($.Pru).move($.Ber))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Pru).move($.Ber), Result.Success),
        new Executed($.A($.Ber).move($.Pru), Result.Success),
        new Executed($.F($.Bal).convoy($.A($.Pru).move($.Ber)), Result.Success),
        new Executed($.A($.Sil).support($.A($.Pru).move($.Ber)), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Pru),
          DiplomacyUnit(Power.Germany, $$.m.F, $$.Bal),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Ber),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Sil)
        )
      ))
    }

    "handle the case that two support orders supports each other." in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.England, $$.m.F, $$.Nth),
          DiplomacyUnit(Power.England, $$.m.F, $$.Nwy)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.F($.Nth).support($.F($.Nwy).hold()),
          $.F($.Nwy).support($.F($.Nth).hold())
        )
      )

      result.result should be(Set(
        new Executed($.F($.Nth).support($.F($.Nwy).hold()), Result.Success),
        new Executed($.F($.Nwy).support($.F($.Nth).hold()), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat)
      ))
    }

    "handle self standoffs." in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Par),
          DiplomacyUnit(Power.France, $$.m.A, $$.Mar)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Par).move($.Bur),
          $.A($.Mar).move($.Bur)
        )
      )

      result.result should be(Set(
        new Executed($.A($.Par).move($.Bur), Result.Bounced),
        new Executed($.A($.Mar).move($.Bur), Result.Bounced)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        provinceStatuses = Map($.Bur.province -> ProvinceStatus.Standoff)
      ))
    }

    "handle self cutting support." in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Par),
          DiplomacyUnit(Power.France, $$.m.A, $$.Bur),
          DiplomacyUnit(Power.France, $$.m.A, $$.Gas),
          DiplomacyUnit(Power.Italy, $$.m.A, $$.Mar)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Par).move($.Bur),
          $.A($.Bur).support($.A($.Gas).move($.Mar)),
          $.A($.Gas).move($.Mar),
          $.A($.Mar).hold()
        )
      )

      result.result should be(Set(
        new Executed($.A($.Par).move($.Bur), Result.Bounced),
        new Executed($.A($.Bur).support($.A($.Gas).move($.Mar)), Result.Success),
        new Executed($.A($.Gas).move($.Mar), Result.Success),
        new Executed($.A($.Mar).hold(), Result.Dislodged($.Gas.province))
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Par),
          DiplomacyUnit(Power.France, $$.m.A, $$.Bur),
          DiplomacyUnit(Power.France, $$.m.A, $$.Mar)
        ),
        unitStatuses = Map($.A($.Mar) -> UnitStatus.Dislodged($.Gas.province))
      ))
    }

    "handle a complex case containing convoys and supports." in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Turkey, $$.m.A, $$.Tun),
          DiplomacyUnit(Power.Turkey, $$.m.F, $$.Tyn),
          DiplomacyUnit(Power.France, $$.m.F, $$.Rom),
          DiplomacyUnit(Power.France, $$.m.F, $$.Wes),
          DiplomacyUnit(Power.Italy, $$.m.A, $$.Ven),
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
          $.F($.Wes).move($.Tyn),
          $.F($.Rom).support($.F($.Wes).move($.Tyn)),
          $.A($.Ven).move($.Rom),
          $.F($.Nap).support($.A($.Ven).move($.Rom))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Tun).move($.Nap), Result.Bounced),
        new Executed($.F($.Tyn).convoy($.A($.Tun).move($.Nap)), Result.Failed),
        new Executed($.F($.Wes).move($.Tyn), Result.Bounced),
        new Executed($.F($.Rom).support($.F($.Wes).move($.Tyn)), Result.Cut),
        new Executed($.A($.Ven).move($.Rom), Result.Bounced),
        new Executed($.F($.Nap).support($.A($.Ven).move($.Rom)), Result.Cut)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat)
      ))
    }
  }
}
