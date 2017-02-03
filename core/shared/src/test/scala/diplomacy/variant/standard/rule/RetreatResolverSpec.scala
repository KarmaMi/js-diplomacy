package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.{ OrderResult, InvalidOrderMessage }
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map.Power
import diplomacy.variant.standard.map.Keywords._
import diplomacy.variant.standard.board.{ Turn => T }
import diplomacy.variant.standard.board.Keywords._
import diplomacy.variant.standard.board.Implicits._
import diplomacy.variant.standard.rule.Keywords._
import diplomacy.variant.standard.rule.Implicits._

class RetreatResolverSpec extends UnitSpec with UsesResolvedResult {
  val resolver = new RetreatResolver {
    type Turn = T
    type Power = map.Power
  }
  val board = {
    new Board[T, map.Power](
      map.map,
      1901.Spring - Retreat,
      Set(
        DiplomacyUnit(France, Army, Bur),
        DiplomacyUnit(France, Army, Mar),
        DiplomacyUnit(Italy, Fleet, Wes)
      ),
      Map(
        DiplomacyUnit(France, Army, Mar) -> UnitStatus.Dislodged(Gas.province),
        DiplomacyUnit(Italy, Fleet, Wes) -> UnitStatus.Dislodged(Tyn.province)
      ),
      Map(Pie.province -> ProvinceStatus(None, true))
    )
  }
  val $ = StandardRuleOrderHelper(board)
  import $._

  "A retreat-resolver" can {
    "resolve a disband order." in {
      val Right(result) =
        resolver(_.copy(season = Autumn))(board, Set(A(Mar).disband(), F(Wes).disband()))
      result.result should be(
        Set(
          new Executed(A(Mar).disband(), Result.Success),
          new Executed(F(Wes).disband(), Result.Success)
        )
      )
      result.board should be(
        board.copy(
          state = 1901.Autumn - Movement,
          units = Set(DiplomacyUnit(France, Army, Bur)),
          unitStatuses = Map[DiplomacyUnit, UnitStatus](),
          provinceStatuses = Map[Province, ProvinceStatus]()
        )
      )
    }
    "resolve a retreat order (1)." in {
      val Right(result) =
        resolver(_.copy(season = Autumn))(board, Set(A(Mar).retreat(Spa), F(Wes).retreat(NAf)))
      result.result should be(
        Set(
          new Executed(A(Mar).retreat(Spa), Result.Success),
          new Executed(F(Wes).retreat(NAf), Result.Success)
        )
      )
      result.board should be(
        board.copy(
          state = 1901.Autumn - Movement,
          units = Set(
            DiplomacyUnit(France, Army, Bur),
            DiplomacyUnit(France, Army, Spa),
            DiplomacyUnit(Italy, Fleet, NAf)
          ),
          unitStatuses = Map[DiplomacyUnit, UnitStatus](),
          provinceStatuses = Map[Province, ProvinceStatus]()
        )
      )
    }
    "resolve a retreat order (2)." in {
      val Right(result) =
        resolver(_.copy(season = Autumn))(board, Set(A(Mar).retreat(Spa), F(Wes).retreat(Spa)))
      result.result should be(
        Set(
          new Executed(A(Mar).retreat(Spa), Result.Failed),
          new Executed(F(Wes).retreat(Spa), Result.Failed)
        )
      )
      result.board should be(
        board.copy(
          state = 1901.Autumn - Movement,
          units = Set(
            DiplomacyUnit(France, Army, Bur)
          ),
          unitStatuses = Map[DiplomacyUnit, UnitStatus](),
          provinceStatuses = Map[Province, ProvinceStatus]()
        )
      )
    }
  }
  it when {
    "resolves a buildable turn" should {
      "go to Build phase." in {
        val board = {
          Board[State, Power, MilitaryBranch, UnitStatus, ProvinceStatus](
            map.map,
            1901.Autumn - Retreat,
            Set(
              DiplomacyUnit(France, Army, Bur),
              DiplomacyUnit(France, Army, Mar),
              DiplomacyUnit(Italy, Fleet, Wes)
            ), Map(), Map()
          )
        }
        val $ = StandardRuleOrderHelper(board)
        import $._

        val Right(result) = resolver(_.copy(season = Autumn))(board, Set())
        result.board should be(
          board.copy(
            state = 1901.Autumn - Build,
            provinceStatuses = Map(
              Bur.province -> ProvinceStatus(Option(France), false),
              Mar.province -> ProvinceStatus(Option(France), false),
              Wes.province -> ProvinceStatus(Option(Italy), false)
            )
          ))
      }
    }
    "a power controls half of supply centers" should {
      "finish the game." in {
        val board = {
          Board[State, Power, MilitaryBranch, UnitStatus, ProvinceStatus](
            map.map, 1901.Autumn - Retreat,
            Set(),
            Map(),
            Map(
              StP.province -> ProvinceStatus[Power](Option(France), false),
              Swe.province -> ProvinceStatus[Power](Option(France), false),
              Nwy.province -> ProvinceStatus[Power](Option(France), false),
              Den.province -> ProvinceStatus[Power](Option(France), false),
              Lvp.province -> ProvinceStatus[Power](Option(France), false),
              Edi.province -> ProvinceStatus[Power](Option(France), false),
              Lon.province -> ProvinceStatus[Power](Option(France), false),
              Ber.province -> ProvinceStatus[Power](Option(France), false),
              Kie.province -> ProvinceStatus[Power](Option(France), false),
              Mun.province -> ProvinceStatus[Power](Option(France), false),
              Hol.province -> ProvinceStatus[Power](Option(France), false),
              Bel.province -> ProvinceStatus[Power](Option(France), false),
              Bre.province -> ProvinceStatus[Power](Option(France), false),
              Par.province -> ProvinceStatus[Power](Option(France), false),
              Mar.province -> ProvinceStatus[Power](Option(France), false),
              Spa.province -> ProvinceStatus[Power](Option(France), false),
              Por.province -> ProvinceStatus[Power](Option(France), false),
              Tun.province -> ProvinceStatus[Power](Option(France), false)
            )
          )
        }
        val $ = StandardRuleOrderHelper(board)
        import $._

        val Right(result) = resolver(_.copy(season = Autumn))(board, Set())
        result.isFinished should be(true)
      }
    }
  }
}
