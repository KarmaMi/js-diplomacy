package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.{ OrderResult, InvalidOrderMessage }
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._
import diplomacy.variant.standard.board.{ Turn => T}
import diplomacy.variant.standard.board._

class RetreatResolverSpec extends UnitSpec {
  val resolver = new RetreatResolver {
    type Turn = T
    type Power = map.Power
  }
  val board = {
    Board[State[T], map.Power, MilitaryBranch, UnitStatus, ProvinceStatus](
      map.map,
      1901.Spring - Retreat,
      Set(
        DiplomacyUnit(France, Army, Bur),
        DiplomacyUnit(France, Army, Mar),
        DiplomacyUnit(Italy, Fleet, Wes)
      ), Map(),
      Map(
        DiplomacyUnit(France, Army, Mar) -> UnitStatus.Dislodged(Gas.province),
        DiplomacyUnit(Italy, Fleet, Wes) -> UnitStatus.Dislodged(Tyn.province)
      ),
      Map(Pie.province -> ProvinceStatus.Standoff)
    )
  }
  val $ = StandardRuleOrderHelper(board)
  import $._
  type Executed =
    OrderResult.Executed[resolver.Power, resolver.MilitaryBranch, resolver.Order, resolver.Result]

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
            ), Map(), Map(), Map()
          )
        }
        val $ = StandardRuleOrderHelper(board)
        import $._

        val Right(result) = resolver(_.copy(season = Autumn))(board, Set())
        result.board should be(
          board.copy(
            state = 1901.Autumn - Build,
            occupation = Map(
              Bur.province -> France,
              Mar.province -> France,
              Wes.province -> Italy
            )
          ))
      }
    }
  }
}
