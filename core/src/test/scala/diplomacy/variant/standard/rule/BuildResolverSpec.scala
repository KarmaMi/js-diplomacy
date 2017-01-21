package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.{ OrderResult, InvalidOrderMessage }
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._
import diplomacy.variant.standard.board.{ Turn => T}
import diplomacy.variant.standard.board._

class BuildResolverSpec extends UnitSpec {
  val resolver = new BuildResolver {
    type Turn = T
    type Power = map.Power
  }
  val board = {
    Board[State[T], map.Power, MilitaryBranch.MilitaryBranch, UnitStatus.UnitStatus, ProvinceStatus.ProvinceStatus](
      map.map,
      1901.Autumn - Build,
      Set(
        DiplomacyUnit(Germany, Army, Mun),
        DiplomacyUnit(Italy, Fleet, Nap)
      ),
      Map(
        Rom.province -> Italy, Nap.province -> Italy,
        Mar.province -> France
      ),
      Map(), Map()
    )
  }
  val $ = StandardRuleOrderHelper(board)
  import $._
  type Executed =
    OrderResult.Executed[resolver.Power, resolver.MilitaryBranch, resolver.Order, resolver.Result]

  "A build-resolver" can {
    "resolve a build order." in {
      val Right(result) =
        resolver(_.copy(year = 1902, season = Spring))(board, Set(Rom.build(Fleet)))
      result.result should be(
        Set(
          new Executed(Rom.build(Fleet), Result.Success)
        )
      )
      result.board should be(
        board.copy(
          state = 1902.Spring - Movement,
          units = Set(
            DiplomacyUnit(Germany, Army, Mun),
            DiplomacyUnit(Italy, Fleet, Rom),
            DiplomacyUnit(Italy, Fleet, Nap)
          ),
          unitStatuses = Map[DiplomacyUnit, UnitStatus.UnitStatus](),
          provinceStatuses = Map[Province, ProvinceStatus.ProvinceStatus]()
        )
      )
    }
    "resolve a disband order." in {
      val Right(result) =
        resolver(_.copy(year = 1902, season = Spring))(board, Set(A(Mun).disband()))
      result.result should be(
        Set(
          new Executed(A(Mun).disband(), Result.Success)
        )
      )
      result.board should be(
        board.copy(
          state = 1902.Spring - Movement,
          units = Set(
            DiplomacyUnit(Italy, Fleet, Nap)
          ),
          unitStatuses = Map[DiplomacyUnit, UnitStatus.UnitStatus](),
          provinceStatuses = Map[Province, ProvinceStatus.ProvinceStatus]()
        )
      )
    }
  }
}
