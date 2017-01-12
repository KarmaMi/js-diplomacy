package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.OrderResult
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._

class MovementResolverStandoffSpec extends UnitSpec {
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
    "handle DIAGRAM 4" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ber),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.War)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Ber).move($.Sil),
          $.A($.War).move($.Sil)
        )
      )

      result.result should be(Set(
        new Executed($.A($.Ber).move($.Sil), Result.Bounced),
        new Executed($.A($.War).move($.Sil), Result.Bounced)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        provinceStatuses = Map($.Sil.province -> ProvinceStatus.Standoff)
      ))
    }

    "handle DIAGRAM 5" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Kie),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ber),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Pru)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Kie).move($.Ber),
          $.A($.Ber).move($.Pru),
          $.A($.Pru).hold()
        )
      )

      result.result should be(Set(
        new Executed($.A($.Ber).move($.Pru), Result.Bounced),
        new Executed($.A($.Kie).move($.Ber), Result.Bounced),
        new Executed($.A($.Pru).hold(), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat)
      ))
    }

    "handle DIAGRAM 6" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Ber),
          DiplomacyUnit(Power.Russia, $$.m.A, $$.Pru)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Ber).move($.Pru),
          $.A($.Pru).move($.Ber))
        )

      result.result should be(Set(
        new Executed($.A($.Ber).move($.Pru), Result.Bounced),
        new Executed($.A($.Pru).move($.Ber), Result.Bounced)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat)
      ))
    }

    "handle DIAGRAM 7" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.England, $$.m.F, $$.Bel),
          DiplomacyUnit(Power.England, $$.m.F, $$.Nth),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Hol)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.F($.Bel).move($.Nth),
          $.F($.Nth).move($.Hol),
          $.A($.Hol).move($.Bel)
        )
      )

      result.result should be(Set(
        new Executed($.F($.Bel).move($.Nth), Result.Success),
        new Executed($.F($.Nth).move($.Hol), Result.Success),
        new Executed($.A($.Hol).move($.Bel), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.England, $$.m.F, $$.Hol),
          DiplomacyUnit(Power.England, $$.m.F, $$.Nth),
          DiplomacyUnit(Power.Germany, $$.m.A, $$.Bel)
        )
      ))
    }
  }
}
